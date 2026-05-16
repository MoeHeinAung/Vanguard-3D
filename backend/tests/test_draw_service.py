import pytest

def test_create_draw(draw_service):
    """Test creating a draw through the service."""
    result = draw_service.create_draw("2026-12-31", "23:59:59", "Test Notes")
    assert result is True
    
    draws = draw_service.get_all_draws()
    assert len(draws) == 1
    assert draws[0]['draw_date'] == "2026-12-31"
    assert draws[0]['status'] == "Open"

def test_update_statuses_closes_past_draws(draw_service, temp_db):
    """Verify that draws past their cutoff are closed."""
    # 1. Manually insert a draw in the past
    with temp_db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO draws (draw_date, cutoff_time, status) VALUES ('2020-01-01', '12:00:00', 'Open')"
        )
        conn.commit()

    # 2. Run status update
    updated_count = draw_service.update_statuses()
    assert updated_count == 1
    
    # 3. Verify status changed to 'Closed'
    draws = draw_service.get_all_draws()
    assert draws[0]['status'] == "Closed"

def test_settle_draw(draw_service, temp_db):
    """Verify settling a draw updates its status."""
    with temp_db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO draws (draw_date, cutoff_time, status) VALUES ('2020-01-01', '12:00:00', 'Closed')"
        )
        draw_id = cursor.lastrowid
        conn.commit()
    
    success = draw_service.settle_draw(draw_id)
    assert success is True
    
    draws = draw_service.get_all_draws()
    assert draws[0]['status'] == "Settled"
