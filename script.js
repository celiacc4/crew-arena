(() => {
  "use strict";

  const STORAGE_KEY = "todo-tasks-v1";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyMsg = document.getElementById("empty-msg");
  const counter = document.getElementById("counter");
  const clearDoneBtn = document.getElementById("clear-done");

  /** @type {{id: string, text: string, done: boolean}[]} */
  let tasks = load();

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    list.replaceChildren();

    for (const task of tasks) {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");
      li.dataset.id = task.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", "Marcar como completada");

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text; // textContent evita inyección de HTML

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "delete-btn";
      delBtn.textContent = "×";
      delBtn.setAttribute("aria-label", "Eliminar tarea");

      li.append(checkbox, span, delBtn);
      list.appendChild(li);
    }

    emptyMsg.hidden = tasks.length > 0;
    const pending = tasks.filter((t) => !t.done).length;
    counter.textContent = `${pending} pendiente${pending === 1 ? "" : "s"} de ${tasks.length}`;
    clearDoneBtn.hidden = tasks.every((t) => !t.done);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({ id: crypto.randomUUID(), text, done: false });
    input.value = "";
    save();
    render();
    input.focus();
  });

  list.addEventListener("change", (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    const id = e.target.closest(".task-item")?.dataset.id;
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    task.done = e.target.checked;
    save();
    render();
  });

  list.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLButtonElement)) return;
    const id = e.target.closest(".task-item")?.dataset.id;
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  });

  clearDoneBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.done);
    save();
    render();
  });

  render();
})();
