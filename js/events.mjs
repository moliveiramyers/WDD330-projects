export async function loadUpcomingEvents() {
    try {
        const res = await fetch("../json/events.json");
        if (!res.ok) throw new Error("Error loading events");
        const events = await res.json();

        const now = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(now.getDate() + 14);

        let upcoming = events.filter(ev => {
            const evDate = new Date(ev.date + "T" + ev.time);
            return evDate >= now && evDate <= twoWeeksLater;
        });

        upcoming.sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));

        const html = upcoming.length ? upcoming.map(ev => `
            <div class="event-card">
                <h4>${ev.title}</h4>
                <p class="event-date">${new Date(ev.date).toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "long" })} - ${ev.time}</p>
                <a href="${getGoogleCalendarLink(ev)}" target="_blank" class="add-to-calendar-btn">Add to Google Calendar</a>
            </div>
        `).join("") : "<p>Sem eventos nas próximas duas semanas.</p>";

        const container = document.getElementById("upcoming-events");
        if (container) container.innerHTML = html;

    } catch (err) {
        console.error("Erro ao carregar eventos:", err);
        const container = document.getElementById("upcoming-events");
        if (container) container.innerHTML = `<p>Erro ao carregar eventos: ${err.message}</p>`;
    }
}

// Add to Google Calendar Event 
function pad(n) { return n.toString().padStart(2, "0"); }

function getGoogleCalendarLink(event) {
    const [year, month, day] = event.date.split("-");
    const [hours, minutes] = event.time.split(":");

    const start = `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;

    const endDate = new Date(year, month - 1, day, hours, minutes + 60);
    const end = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    return url;
}
