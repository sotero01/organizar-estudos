document.addEventListener('DOMContentLoaded', function () {
    const daysContainer = document.getElementById('days');
    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    function getActivities(day) {
        const storedActivities = localStorage.getItem(day);
        return storedActivities ? JSON.parse(storedActivities) : [];
    }

    function saveActivities(day, activities) {
        localStorage.setItem(day, JSON.stringify(activities));
        displayActivities(day, activities);
    }

    function displayActivities(day, activities) {
        const dayElement = document.getElementById(day.toLowerCase());
        const activitiesList = dayElement.querySelector('.activities');

        activitiesList.innerHTML = '';

        activities.forEach((activity, index) => {
            const activityItem = document.createElement('div');
            activityItem.className = 'task';
            activityItem.innerHTML = `<strong>${activity.startTime}:</strong> ${activity.task} <button class="delete-btn" data-index="${index}">Excluir</button>`;
            activityItem.style.color = activity.color;

            activitiesList.appendChild(activityItem);
        });

        // Adiciona event listener para os botões de exclusão
        const deleteButtons = activitiesList.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(button.getAttribute('data-index'));
                const activities = getActivities(day);
                activities.splice(index, 1); // Remove a atividade da lista
                saveActivities(day, activities);
            });
        });
    }

    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.id = day.toLowerCase();
        dayElement.innerHTML = `<h2>${day}</h2><div class="activities"></div>`;

        dayElement.addEventListener('click', function () {
            const dayName = day.toLowerCase();
            const newTask = prompt(`Adicionar tarefa para ${day}:`);
            const startTime = prompt(`Horário de início para ${newTask}:`);

            if (newTask && startTime) {
                const activities = getActivities(dayName);
                const existingTask = activities.find(activity => activity.task.toLowerCase() === newTask.toLowerCase());

                if (existingTask) {
                    existingTask.color = getRandomColor();
                } else {
                    activities.push({ task: newTask, color: getRandomColor(), startTime: startTime });
                }

                saveActivities(dayName, activities);
            }
        });

        daysContainer.appendChild(dayElement);

        const activities = getActivities(day.toLowerCase());
        displayActivities(day.toLowerCase(), activities);
    });

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
