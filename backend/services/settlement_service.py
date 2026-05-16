import sqlite3

class SettlementService:
    def __init__(self, db):
        self.db = db

    def add_blacklist_ticket(self, draw_id, ticket, type):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO blacklist_tickets (draw_id, ticket, type)
                VALUES (?, ?, ?)
            ''', (draw_id, ticket, type))
            conn.commit()
        return True

    def get_blacklist_tickets(self, draw_id=None):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            if draw_id:
                cursor.execute('SELECT * FROM blacklist_tickets WHERE draw_id = ? ORDER BY created_at DESC', (draw_id,))
            else:
                cursor.execute('SELECT * FROM blacklist_tickets ORDER BY created_at DESC')
            return [dict(row) for row in cursor.fetchall()]

    def add_winning_ticket(self, draw_id, ticket, type):
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO winning_tickets (draw_id, ticket, type)
                VALUES (?, ?, ?)
            ''', (draw_id, ticket, type))
            conn.commit()
        return True

    def get_winning_tickets(self, draw_id=None):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            if draw_id:
                cursor.execute('SELECT * FROM winning_tickets WHERE draw_id = ? ORDER BY created_at DESC', (draw_id,))
            else:
                cursor.execute('SELECT * FROM winning_tickets ORDER BY created_at DESC')
            return [dict(row) for row in cursor.fetchall()]

    def calculate_settlement(self, draw_id):
        with self.db.get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            # Fetch Draw Info
            cursor.execute('SELECT * FROM draws WHERE id = ?', (draw_id,))
            draw_row = cursor.fetchone()
            if not draw_row:
                return {"status": "error", "message": "Draw not found"}
            draw = dict(draw_row)

            # Fetch Agents and MDs
            cursor.execute('SELECT * FROM agents')
            agents = {row['id']: dict(row) for row in cursor.fetchall()}
            cursor.execute('SELECT * FROM master_dealers')
            mds = {row['id']: dict(row) for row in cursor.fetchall()}
            
            # Fetch Sales for this draw
            cursor.execute('SELECT * FROM sales WHERE draw_id = ?', (draw_id,))
            sales = [dict(row) for row in cursor.fetchall()]
            
            # Fetch Offloads for this draw
            cursor.execute('SELECT * FROM offloaded_tickets WHERE draw_id = ?', (draw_id,))
            offloads = [dict(row) for row in cursor.fetchall()]
            
            # Fetch Blacklists and Winners
            cursor.execute('SELECT * FROM blacklist_tickets WHERE draw_id = ?', (draw_id,))
            blacklists = {row['ticket']: row['type'] for row in cursor.fetchall()}
            cursor.execute('SELECT * FROM winning_tickets WHERE draw_id = ?', (draw_id,))
            winners = {row['ticket']: row['type'] for row in cursor.fetchall()}
            
            # --- AGENT REPORTS ---
            agent_reports = []
            for agent_id, agent_info in agents.items():
                a_sales = [s for s in sales if s['agent_id'] == agent_id]
                if not a_sales: continue
                
                total_sale = sum(s['amount'] for s in a_sales)
                total_comm = total_sale * (agent_info['commission'] / 100)
                total_payout = 0
                winning_records = []
                
                for s in a_sales:
                    if s['ticket'] in winners:
                        w_type = winners[s['ticket']]
                        factor = agent_info['jp_factor'] if w_type == 'Jackpot' else agent_info['sp_factor']
                        payout = s['amount'] * factor
                        if blacklists.get(s['ticket']) == 'HALF':
                            payout *= 0.5
                        total_payout += payout
                        winning_records.append({
                            'ticket': s['ticket'],
                            'amount': s['amount'],
                            'type': w_type,
                            'payout': payout
                        })
                
                agent_reports.append({
                    'id': agent_id,
                    'name': agent_info['name'],
                    'sales': total_sale,
                    'commission': total_comm,
                    'payout': total_payout,
                    'net': total_sale - total_comm - total_payout,
                    'winners': winning_records
                })

            # --- MASTER DEALER REPORTS ---
            md_reports = []
            for md_id, md_info in mds.items():
                m_offloads = [o for o in offloads if o['master_dealer_id'] == md_id]
                if not m_offloads: continue
                
                total_offload = sum(o['amount'] for o in m_offloads)
                total_comm = total_offload * (md_info['commission'] / 100)
                total_payout = 0
                winning_records = []
                
                for o in m_offloads:
                    if o['ticket'] in winners:
                        w_type = winners[o['ticket']]
                        factor = md_info['jp_factor'] if w_type == 'Jackpot' else md_info['sp_factor']
                        payout = o['amount'] * factor
                        if blacklists.get(o['ticket']) == 'HALF':
                            payout *= 0.5
                        total_payout += payout
                        winning_records.append({
                            'ticket': o['ticket'],
                            'amount': o['amount'],
                            'type': w_type,
                            'payout': payout
                        })
                
                md_reports.append({
                    'id': md_id,
                    'name': md_info['name'],
                    'offload': total_offload,
                    'commission': total_comm,
                    'payout': total_payout,
                    'net': total_offload - total_comm - total_payout,
                    'winners': winning_records
                })

            # --- HOUSE REPORT ---
            global_sales = sum(s['amount'] for s in sales)
            global_agent_payouts = sum(r['payout'] for r in agent_reports)
            global_agent_comms = sum(r['commission'] for r in agent_reports)
            global_offload = sum(o['amount'] for o in offloads)
            global_md_payouts = sum(r['payout'] for r in md_reports)
            global_md_comms = sum(r['commission'] for r in md_reports)
            
            # House net before offload recovery
            net_house_raw = global_sales - global_agent_comms - global_agent_payouts
            # MD net is what the MD keeps. House recovers (Offload - MD_Comm - MD_Payouts)
            md_total_net = sum(r['net'] for r in md_reports)
            final_house_net = net_house_raw - md_total_net

            house_report = {
                'sales': global_sales,
                'agent_commission': global_agent_comms,
                'agent_payouts': global_agent_payouts,
                'offload': global_offload,
                'md_commission': global_md_comms,
                'md_payouts': global_md_payouts,
                'net': final_house_net
            }

            return {
                'status': 'success',
                'draw': draw,
                'agents': agent_reports,
                'master_dealers': md_reports,
                'house': house_report
            }
