const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const message = document.getElementById('message');

const tasks = [];

// Cria um ícone decorativo para os botões.
function createIcon(symbol) {
    const icon = document.createElement('span');
    icon.className = 'button-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = symbol;
    return icon;
}

// Cria o texto da tarefa e aplica o estilo de concluída quando necessário.
function createTaskText(task) {
    const text = document.createElement('span');
    text.className = task.completed ? 'task-text completed' : 'task-text';
    text.textContent = task.text;
    return text;
}

// Cria o botão que conclui a tarefa ou desfaz a conclusão.
function createCompleteButton(task) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'complete-button';
    button.dataset.action = 'toggle';
    button.append(
        createIcon(task.completed ? '↶' : '✓'),
        document.createTextNode(task.completed ? 'Desfazer' : 'Concluir')
    );
    button.setAttribute('aria-pressed', String(task.completed));
    button.setAttribute(
        'aria-label',
        `${task.completed ? 'Desfazer conclusão' : 'Concluir'}: ${task.text}`
    );
    return button;
}

// Cria o botão que remove a tarefa da lista.
function createDeleteButton(task) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'delete-button';
    button.dataset.action = 'delete';
    button.append(createIcon('×'), document.createTextNode('Excluir'));
    button.setAttribute('aria-label', `Excluir tarefa: ${task.text}`);
    return button;
}

// Agrupa os botões de ação da tarefa.
function createTaskActions(task) {
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.append(createCompleteButton(task), createDeleteButton(task));
    return actions;
}

// Cria um item da lista com o índice usado para localizar a tarefa no array.
function createTaskItem(task, index) {
    const item = document.createElement('li');
    item.className = 'task-item';
    item.dataset.index = index;
    item.append(createTaskText(task), createTaskActions(task));
    return item;
}

// Cria a mensagem exibida quando a lista está vazia.
function createEmptyItem() {
    const item = document.createElement('li');
    item.className = 'empty-message';
    item.textContent = 'Nenhuma tarefa por enquanto.';
    return item;
}

// Atualiza os itens exibidos conforme o conteúdo do array de tarefas.
function renderTasks() {
    taskList.textContent = '';

    if (tasks.length === 0) {
        taskList.appendChild(createEmptyItem());
        return;
    }

    tasks.forEach((task, index) => {
        taskList.appendChild(createTaskItem(task, index));
    });
}

// Remove o estado de erro e a mensagem de validação do campo.
function clearInputFeedback() {
    taskInput.classList.remove('error');
    taskInput.removeAttribute('aria-invalid');
    message.textContent = '';
}

// Verifica se já existe uma tarefa com o mesmo nome, ignorando maiúsculas.
function taskAlreadyExists(text) {
    const normalizedText = text.toLowerCase();
    return tasks.some((task) => task.text.toLowerCase() === normalizedText);
}

/* validando o input para não permitir que o usuário adicione uma tarefa vazia
Adiciona a tarefa ao array e atualiza a lista exibida. */
form.addEventListener('submit', (event) => {
    event.preventDefault();

    //limpo o input e transformo em minusculo para evitar duplicidade de tarefas.
    const text = taskInput.value.trim().toLowerCase();
    
    if (text === '') {
        taskInput.classList.add('error');
        taskInput.setAttribute('aria-invalid', 'true');
        message.textContent = 'Digite uma tarefa antes de adicionar.';
        window.alertmsg.show('Digite uma tarefa antes de adicionar.');
        taskInput.focus();
        return;
    }

    if (text.length < 2) {
        taskInput.classList.add('error');
        taskInput.setAttribute('aria-invalid', 'true');
        message.textContent = 'A tarefa deve ter pelo menos 2 caracteres.';
        window.alertmsg.show('A tarefa deve ter pelo menos 2 caracteres.');
        taskInput.focus();
        return;
    }

    if (taskAlreadyExists(text)) {
        taskInput.classList.add('error');
        taskInput.setAttribute('aria-invalid', 'true');
        message.textContent = 'Essa tarefa já foi adicionada.';
        window.alertmsg.show('Essa tarefa já foi adicionada.');
        taskInput.focus();
        return;
    }

    tasks.push({ text, completed: false });
    renderTasks();
    form.reset();
    clearInputFeedback();
    taskInput.focus();
});

// Remove o estado de erro e a mensagem de validação quando o usuário começa a digitar.
taskInput.addEventListener('input', clearInputFeedback);

//
taskList.addEventListener('click', (event) => {
    const button = event.target instanceof Element
        ? event.target.closest('button[data-action]')
        : null;

    if (!button) {
        return;
    }

    const item = button.closest('.task-item');
    const index = Number(item.dataset.index);

    //verifica o senario indesejado, caso o botão clicado não seja de toggle ou delete, ele retorna sem fazer nada.
    if (button.dataset.action !== 'toggle' && button.dataset.action !== 'delete') {
        return;
    }

    if (button.dataset.action === 'toggle') {
        tasks[index].completed = !tasks[index].completed;
    }

    if (button.dataset.action === 'delete') {
        tasks.splice(index, 1);
    }

    renderTasks();
});

renderTasks();
