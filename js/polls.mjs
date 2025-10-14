const API_URL = "https://68edf923df2025af7801c8d6.mockapi.io/polls";

export async function renderPage() {

    try {
        const response = await fetch(API_URL);
        const polls = await response.json();

        const activePolls = polls.filter(p => p.active);
        const pollsHtml = activePolls.map(poll => {
            const optionsHtml = poll.options.map((opt, i) => `
          <li class="poll-option">
            <span class="option-label">${opt}</span>
            <div class="vote-bar-container">
            <div class="vote-bar" data-index="${i}" style="width:${getVotePercent(poll.votes[i], poll.votes)}%; background-color:${getColor(i)}"></div>
            </div>
            <span class="vote-count">${poll.votes[i]}</span>
            <button class="vote-btn" data-index="${i}" data-id="${poll.id}">Vote</button>
        </li>
      `).join("");

            return `
        <div class="poll-card" data-id="${poll.id}">
          <h3>${poll.title}</h3>
          <p class="poll-description">${poll.description || ""}</p>
          <ul>${optionsHtml}</ul>
          <button class="archive-btn" data-id="${poll.id}">Archive</button>
          <button class="delete-btn" data-id="${poll.id}">Delete</button>
        </div>
      `;
        }).join("");

        return `
      <h2>Polls</h2>
      <div id="poll-form-container">
    <button id="add-poll-btn">Add Poll</button>
    </div>
      <div class="polls-list">
        ${pollsHtml}
      </div>
      <div id="create-result"></div>
    `;

    } catch (err) {
        mainContent.innerHTML = "<p>Could not fetch polls.</p>";
        console.error(err);
    }
}

function getVotePercent(vote, votesArray) {
    const total = votesArray.reduce((a, b) => a + b, 0) || 1;
    return Math.round((vote / total) * 100);
}

function getColor(i) {
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];
    return colors[i % colors.length];
}


// Disables vote buttons if the user already voted
export function updatePollUI(pollCard, pollId) {
    if (hasVoted(pollId)) {
        const buttons = pollCard.querySelectorAll(".vote-btn");
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = 0.5;
            btn.style.cursor = "not-allowed";
        });
    }
}

function hasVoted(pollId) {
    const voted = JSON.parse(localStorage.getItem("votedPolls") || "[]");
    return voted.includes(pollId);
}

function markVoted(pollId) {
    const voted = JSON.parse(localStorage.getItem("votedPolls") || "[]");
    voted.push(pollId);
    localStorage.setItem("votedPolls", JSON.stringify(voted));
}
export async function pollCreator() {
    const form = document.getElementById("create-poll-form");
    const mainContent = document.getElementById("main-content");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = form.title.value;
        const description = form.description.value;
        const options = form.options.value.split(",");
        const votes = options.map(() => 0);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    options,
                    votes,
                    active: true
                })
            });

            const newPoll = await res.json();

            document.getElementById("create-result").innerHTML = `Poll created! ID: ${newPoll.id}`;

            // Add the new poll to the list dynamically
            const pollsList = mainContent.querySelector(".polls-list");
            if (pollsList) {
                const pollCard = document.createElement("div");
                pollCard.classList.add("poll-card");
                pollCard.dataset.id = newPoll.id;

                const pollTitle = document.createElement("h3");
                pollTitle.textContent = newPoll.title;
                pollCard.appendChild(pollTitle);

                const ul = document.createElement("ul");
                newPoll.options.forEach((opt, i) => {
                    const li = document.createElement("li");
                    li.classList.add("poll-option");

                        // Option label on top
                        const label = document.createElement("span");
                        label.classList.add("option-label");
                        label.textContent = opt;

                        // Bar container
                        const barContainer = document.createElement("div");
                        barContainer.classList.add("vote-bar-container");

                        const bar = document.createElement("div");
                        bar.classList.add("vote-bar");
                        bar.style.width = `${getVotePercent(newPoll.votes[i], newPoll.votes)}%`;
                        bar.style.backgroundColor = getColor(i);
                        barContainer.appendChild(bar);

                        // Vote button and count below the bar
                        const bottomContainer = document.createElement("div");
                        bottomContainer.classList.add("option-bottom");

                        const voteBtn = document.createElement("button");
                        voteBtn.classList.add("vote-btn");
                        voteBtn.dataset.index = i;
                        voteBtn.dataset.id = newPoll.id;
                        voteBtn.textContent = "Vote";

                        const count = document.createElement("span");
                        count.classList.add("vote-count");
                        count.textContent = newPoll.votes[i];

                        bottomContainer.appendChild(voteBtn);
                        bottomContainer.appendChild(count);

                        // Append all in order
                        li.appendChild(label);
                        li.appendChild(barContainer);
                        li.appendChild(bottomContainer);

                        ul.appendChild(li);
                    });

                pollCard.appendChild(ul);

                updatePollUI(pollCard, newPoll.id);
                pollsList.appendChild(pollCard);
            }

            form.reset(); // clear form fields
        } catch (err) {
            document.getElementById("create-result").innerHTML = "Error creating poll.";
            console.error(err);
        }
    });
}

// Global click handler
document.addEventListener("click", async e => {
    const target = e.target;

    // ADD POLL
    if (target.id === "add-poll-btn") {
        const container = document.getElementById("poll-form-container");
        if (container.querySelector("#create-poll-form")) return;

        container.innerHTML = `
            <h2>Create Poll</h2>
            <form id="create-poll-form">
                <input type="text" name="title" placeholder="Poll title" required />
                <input type="text" name="description" placeholder="Poll description" />
                <input type="text" name="options" placeholder="Option1,Option2,Option3" required />
                <button type="submit">Create Poll</button>
                <button type="button" id="cancel-poll-btn">Cancel</button>
            </form>
        `;
        pollCreator();

        document.getElementById("cancel-poll-btn").addEventListener("click", () => {
            container.innerHTML = `<button id="add-poll-btn">Add Poll</button>`;
        });
        return;
    }

    // BUTTONS INSIDE POLL CARD
    const pollCard = target.closest(".poll-card");
    if (!pollCard) return;
    const pollId = pollCard.dataset.id;

    // VOTE
    if (target.classList.contains("vote-btn")) {
        const optionIndex = target.dataset.index;
        if (hasVoted(pollId)) {
            alert("You have already voted on this poll!");
            return;
        }

        const res = await fetch(`${API_URL}/${pollId}`);
        const poll = await res.json();
        poll.votes[optionIndex] += 1;

        await fetch(`${API_URL}/${pollId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(poll)
        });

        markVoted(pollId);

        // Update UI
        const li = pollCard.querySelectorAll(".poll-option")[optionIndex];
        li.querySelector(".vote-count").textContent = poll.votes[optionIndex];
        li.querySelector(".vote-bar").style.width = `${getVotePercent(poll.votes[optionIndex], poll.votes)}%`;

        updatePollUI(pollCard, pollId);
        return;
    }

    // ARCHIVE
    if (target.classList.contains("archive-btn")) {
        await fetch(`${API_URL}/${pollId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active: false })
        });
        pollCard.remove();
        return;
    }

    // DELETE
    if (target.classList.contains("delete-btn")) {
        await fetch(`${API_URL}/${pollId}`, { method: "DELETE" });
        pollCard.remove();
        return;
    }


    // 2️⃣ Handle Add Poll button separately
    if (e.target.id === "add-poll-btn") {
        const container = document.getElementById("poll-form-container");
        if (container.querySelector("#create-poll-form")) return;

        container.innerHTML = `
            <h2>Create Poll</h2>
            <form id="create-poll-form">
                <input type="text" name="title" placeholder="Poll title" required />
                <input type="text" name="description" placeholder="Poll description" />
                <input type="text" name="options" placeholder="Option1,Option2,Option3" required />
                <button type="submit">Create Poll</button>
                <button type="button" id="cancel-poll-btn">Cancel</button>
            </form>
        `;

        pollCreator();

        document.getElementById("cancel-poll-btn").addEventListener("click", () => {
            container.innerHTML = `<button id="add-poll-btn">Add Poll</button>`;
        });
    }
});
