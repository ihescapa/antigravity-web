import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import Session, ChronoGrid, ChronogramEntry, Base, engine
from datetime import datetime, timedelta

def get_time_slots(start_str, end_str, interval_mins=10):
    start = datetime.strptime(start_str, "%H:%M")
    end = datetime.strptime(end_str, "%H:%M")
    slots = []
    curr = start
    while curr <= end:
        slots.append(curr.strftime("%H:%M"))
        curr += timedelta(minutes=interval_mins)
    return slots

def rearm():
    # Ensure tables are created
    Base.metadata.create_all(engine)
    
    session = Session()
    days = ["Lunes 7", "Martes 8", "Miércoles 9", "Jueves 10", "Viernes 11"]
    rooms = [
        "Escuela Grupo 1", 
        "Escuela Grupo 2", 
        "Escuela Grupo 3", 
        "Escuela Grupo 4", 
        "Escuela Grupo 5", 
        "Cursos Posgrado (UNPSJB)",
        "Salón Auditorio",
        "Sala de Reuniones"
    ]
    slots = get_time_slots("08:00", "20:00")
    
    # Get existing entries to map them
    existing_entries = session.query(ChronogramEntry).all()
    
    def get_minutes(t_str):
        h, m = map(int, t_str.split(':'))
        return h * 60 + m

    print("Populating grid...")
    count = 0
    for day in days:
        day_entries = [e for e in existing_entries if e.day == day]
        for room in rooms:
            for slot in slots:
                # Check if this slot was already populated
                existing = session.query(ChronoGrid).filter_by(day=day, room=room, timeslot=slot).first()
                if existing:
                    continue
                
                slot_min = get_minutes(slot)
                
                # Find if any existing entry covers this slot
                matched_entry = None
                for entry in day_entries:
                    if entry.room == room:
                        start_min = get_minutes(entry.start)
                        end_min = get_minutes(entry.end)
                        if start_min <= slot_min < end_min:
                            matched_entry = entry
                            break
                
                new_slot = ChronoGrid(
                    day=day,
                    room=room,
                    timeslot=slot,
                    activity_id=matched_entry.id if matched_entry else None,
                    content=matched_entry.label if matched_entry else ""
                )
                session.add(new_slot)
                count += 1
                if count % 100 == 0:
                    session.commit()
    
    session.commit()
    print(f"Finished. Added/Checked {count} slots.")
    session.close()

if __name__ == "__main__":
    rearm()
