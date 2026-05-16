import pytest

def test_settlement_calculation_basic(settlement_service, temp_db):
    """
    Verify basic settlement math: Sales - Commission = Net
    """
    # 1. Setup Data
    with temp_db.get_connection() as conn:
        cursor = conn.cursor()
        # Create Draw
        cursor.execute("INSERT INTO draws (draw_date, cutoff_time, status) VALUES ('2024-01-01', '12:00:00', 'Closed')")
        draw_id = cursor.lastrowid
        
        # Create Agent (10% commission)
        cursor.execute("INSERT INTO agents (id, name, commission, jp_factor, sp_factor) VALUES ('A01', 'Test Agent', 10.0, 500, 10)")
        
        # Create Sale (1000 Ks)
        cursor.execute("INSERT INTO sales (draw_id, agent_id, ticket, amount) VALUES (?, 'A01', '123', 1000)", (draw_id,))
        conn.commit()

    # 2. Execute Settlement
    result = settlement_service.calculate_settlement(draw_id)

    # 3. Assert Results
    assert result['status'] == 'success'
    report = result['agents'][0]
    assert report['sales'] == 1000.0
    assert report['commission'] == 100.0  # 10% of 1000
    assert report['payout'] == 0.0
    assert report['net'] == 900.0

def test_settlement_with_winner_and_blacklist(settlement_service, temp_db):
    """
    Verify settlement with a winner and HALF reduction via blacklist.
    """
    with temp_db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO draws (draw_date, cutoff_time, status) VALUES ('2024-01-01', '12:00:00', 'Closed')")
        draw_id = cursor.lastrowid
        
        # Agent: 10% commission, 500x JP factor
        cursor.execute("INSERT INTO agents (id, name, commission, jp_factor, sp_factor) VALUES ('A01', 'Winner Agent', 10.0, 500.0, 10.0)")
        
        # Sale: 100 Ks on ticket '777'
        cursor.execute("INSERT INTO sales (draw_id, agent_id, ticket, amount) VALUES (?, 'A01', '777', 100)", (draw_id,))
        
        # Declare '777' as Jackpot Winner
        cursor.execute("INSERT INTO winning_tickets (draw_id, ticket, type) VALUES (?, '777', 'Jackpot')", (draw_id,))
        
        # Add '777' to Blacklist with HALF reduction
        cursor.execute("INSERT INTO blacklist_tickets (draw_id, ticket, type) VALUES (?, '777', 'HALF')", (draw_id,))
        
        conn.commit()

    # Calculation:
    # Sale: 100
    # Comm: 10% = 10
    # Payout: 100 * 500 (JP) * 0.5 (HALF) = 25,000
    # Net: 100 - 10 - 25,000 = -24,910
    
    result = settlement_service.calculate_settlement(draw_id)
    assert result['status'] == 'success'
    report = result['agents'][0]
    assert report['payout'] == 25000.0
    assert report['net'] == -24910.0
