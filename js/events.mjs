export async function loadUpcomingEvents() {
    try {
        const res = await fetch("../json/events.json");
        if (!res.ok) throw new Error("Error loading events");
        const events = await res.json();

        const now = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(now.getDate() + 14);

        let upcoming = events.filter(ev => {
            const evDate = new Date(ev.date);
            return evDate >= now && evDate <= twoWeeksLater;
        });

        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

        const html = upcoming.length ? upcoming.map(
            ev => `
            <div class="event-card">
                <h4>${ev.title}</h4>
                <p class="event-date">${new Date(ev.date).toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "long" })} - ${ev.time}</p>
            </div>
            `
        ).join("") : "<p>Sem eventos nas próximas duas semanas.</p>";
        const container = document.getElementById("upcoming-events");
        if (container) container.innerHTML = html;
    }
    catch (err) {
        console.error("Erro ao carregar eventos:", err);
        const container = document.getElementById("upcoming-events");
        if (container) container.innerHTML = `<p>Erro ao carregar eventos: ${err.message}</p>`;
    }
}

function getGoogleCalendarLink(event) {
    const [day, month, year] = event.date.split("/");
    const [hours, minutes] = event.time.split(":");

    const start = new Date(year, month - 1, day, hours, minutes);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const formatDate = (d) => d.toISOString().replace(/-|:\.\d+/g, '');

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(start)}/${formatDate(end)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    return url;

}