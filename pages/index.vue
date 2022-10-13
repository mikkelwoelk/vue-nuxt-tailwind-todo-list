<template>
    <div class="app text-center w-[min(90%,_500px)] m-auto">
        <transition name="t-fade-up">
            <div
                v-if="showDelete"
                class="c-delete-prompt max-w-sm mx-2 p-8 rounded-xl fixed flex flex-col justify-between bg-[var(--clr-primary)] z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-full"
            >
                <span class="text-3xl mb-4"
                    >Are you sure you want to delete this todo?</span
                >
                <div
                    class="c-delete-prompt__button-wrapper flex justify-between mx-2"
                >
                    <button
                        class="text-2xl py-4 px-6 rounded-md transition-all duration-150 hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_1px_#1f363d]"
                        @click="() => deleteTodo()"
                    >
                        I'm sure
                    </button>
                    <button
                        class="text-2xl py-4 px-6 rounded-md transition-all duration-150 hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_1px_#1f363d]"
                        @click="() => toggleDeletePrompt()"
                    >
                        Hell no!
                    </button>
                </div>
            </div>
        </transition>
        <div
            class="app-wrapper"
            :class="[showDelete ? blurClass : '', bbClass]"
        >
            <div class="c-header__container mt-32">
                <img
                    src="../static/logo.png"
                    class="app-logo w-[max(20rem,_100px)] m-auto border-none"
                    alt="Todo list clipboard"
                />
                <h1 class="font-normal text-7xl">{{ header }}</h1>
                <h2 class="font-normal text-4xl">{{ subheader }}</h2>
            </div>
            <div
                class="c-form__container my-8 rounded-xl overflow-hidden max-h-[50.5px] transition-[max-height] ease-in-out duration-500"
                :class="{ 'max-h-[278px]': newTodo.title !== '' }"
            >
                <form class="flex flex-col" @submit.prevent="addTodo">
                    <label for="todoTitle"></label>
                    <input
                        type="text"
                        ref="inputTitle"
                        name="todoTitle"
                        class="c-form__title-input"
                        placeholder="Add a new Todo"
                        maxlength="25"
                        required
                        v-model.trim="newTodo.title"
                    />
                    <label for="todoDesc"></label>
                    <input
                        type="text"
                        name="todoDesc"
                        class="c-form__description-input"
                        placeholder="Describe it further if needed.."
                        maxlength="200"
                        v-model.trim="newTodo.description"
                    />
                    <label for="importance"></label>
                    <fieldset
                        class="c-form__radio-container grid grid-cols-3"
                        name="importance"
                    >
                        <input
                            class="importance-radio"
                            type="radio"
                            name="importance"
                            id="c-form__importance-radio-green"
                            style="background: rgb(111, 200, 65)"
                            checked
                            @change="onImportanceChange($event, 'green', 1)"
                        />
                        <input
                            class="importance-radio"
                            type="radio"
                            name="importance"
                            id="c-form__importance-radio-yellow"
                            style="background: rgb(197, 200, 65)"
                            @change="onImportanceChange($event, 'yellow', 2)"
                        />
                        <input
                            class="importance-radio"
                            type="radio"
                            name="importance"
                            id="c-form__importance-radio-red"
                            style="background-color: rgb(200, 65, 65)"
                            @change="onImportanceChange($event, 'red', 3)"
                        />
                    </fieldset>
                    <label for="deadline"></label>
                    <input
                        type="datetime-local"
                        name="deadline"
                        class="c-form__deadline-input relative"
                        v-model="newTodo.date"
                    />
                    <button
                        class="c-form__submit-btn p-[2.2rem_2rem_1.8rem] text-2xl rounded-b-xl bg-[var(--clr-primary)] text-[var(--clr-secondary)] transition-all ease duration-500 uppercase outline outline-[var(--clr-secondary)]"
                        type="submit"
                        :class="[newTodo.title ? activeClass : '']"
                    >
                        add todo
                    </button>
                </form>
            </div>
            <div class="c-todos-container">
                <div
                    class="c-todo-filter__button-container flex justify-between items-center"
                >
                    <button
                        class="text-2xl py-4 px-8 rounded-xl transition-all duration-150 hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_1px_#1f363d]"
                        @click="sortImportanceLow"
                    >
                        Sort importance: Low
                    </button>
                    <button
                        class="text-2xl py-4 px-8 rounded-xl transition-all duration-150 hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[-2px_2px_0px_1px_#1f363d]"
                        @click="sortImportanceHigh"
                    >
                        Sort importance: High
                    </button>
                </div>
                <ul class="c-todo-list list-none flex flex-col">
                    <transition-group
                        name="t-fade-in"
                        enter-active-class="fade-from-left"
                        leave-active-class="scale-out"
                    >
                        <todoItem
                            v-for="(todo, index) in todos"
                            :key="todo.id"
                            v-bind="todo"
                            @remove="() => toggleDeletePrompt(index)"
                        >
                        </todoItem>
                    </transition-group>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import todoItem from '../components/TodoItem.vue'
export default {
    name: 'app', // Points to the HTML elements in with to place everything
    components: { todoItem },
    data() {
        // Stores all of the data to be used in the vue instance
        return {
            header: 'Todo List', // Sets the innerHTML of the h1
            subheader:
                'Make a new todo! You can also add a description and choose importance.', // Sets the innerHTML of the h2
            newTodo: {
                // Object for a new todo
                id: '',
                title: '', // Value for todo title
                description: '', // Value for todo description
                importance: { color: 'green', num: 1 }, // Value for todo importance (Defaulting to green)
                date: moment().format('YYYY[-]MM[-]DDTHH:mm'), // Value for date picker (Sets the value to the date and time as it is right now when the page is loaded)
            },
            todos: [
                // Array of todo objects
                {
                    id: '1',
                    title: 'Make a todo list',
                    description: 'It has to have alot of nice features',
                    importance: { color: 'green', num: 1 },
                    date: moment().add('4', 'weeks').fromNow(),
                },
                {
                    id: '2',
                    title: 'This is a medium todo',
                    description: 'It has the same color as a banana',
                    importance: { color: 'yellow', num: 2 },
                    date: moment().add('10', 'days').fromNow(),
                },
                {
                    id: '3',
                    title: 'This is a max length todo',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis justo eros, a ullamcorper orci rhoncus sed. Phasellus blandit risus elit, et hendrerit ipsum tempor venenatis. Vestibulum dictum',
                    importance: { color: 'red', num: 3 },
                    date: moment().add('1', 'hours').fromNow(),
                },
            ],
            activeClass: 'isActive', // Class style for when the submit button is active (Activates when the user types something in the todo title input)
            dateTime: '', // Empty string for storing the date and time (updateTime() updates the date/time in the date picker every minute)
            showDelete: false,
            deletingIndex: null,
            bbClass: 'transition-all duration 250ms',
            blurClass: 'opacity-50 pointer-events-none blur-sm',
        }
    },
    methods: {
        // Object that stores functions
        addTodo() {
            // Adds a new todo object to the todos array, as well as getting and setting the date/time from the date picker into the todoDate. Then resets the inputs for the next todo (except the importance)
            this.newTodo.date = moment(this.newTodo.date).fromNow() // Sets the date/time of the todo to the user selected input and shows the time till its due
            this.newTodo.id = Math.random().toString(36).substring(2)
            this.todos.push(this.newTodo) // Pushes the todo object into the todo array
            this.newTodo = {
                // Resets all of the input in some way
                title: '',
                description: '',
                importance: {
                    color: this.newTodo.importance.color,
                    num: this.newTodo.importance.num,
                }, // Except this one because reasons..
                date: moment().format('YYYY[-]MM[-]DDTHH:mm'),
            }
            this.$refs.inputTitle.focus()
        },
        onImportanceChange(e, color, num) {
            // Gets the color value from the selected importance radio button and sets the todoImportance to said color
            // Also sets the number for the importance sort the todos later (1 = low importance, 3 = high importance)
            if (e.target.checked) {
                this.newTodo.importance.color = color
                this.newTodo.importance.num = num
            }
        },
        updateTime() {
            // Gets the actual date/time from moments.js
            this.newTodo.date = moment().format('YYYY[-]MM[-]DDTHH:mm')
        },
        sortImportanceLow() {
            // Sorts todos after lowest importance by sorting after the importanceNum dependency
            this.todos.sort((a, b) =>
                a.importance.num >= b.importance.num ? 1 : -1
            )
        },
        sortImportanceHigh() {
            // Sorts todos after highest importance by sorting after the importanceNum dependency
            this.todos.sort((a, b) =>
                a.importance.num <= b.importance.num ? 1 : -1
            )
        },
        toggleDeletePrompt(index) {
            this.deletingIndex = index
            this.showDelete = !this.showDelete
        },
        deleteTodo() {
            this.showDelete = false
            // Deletes a todo by removing it from the array
            this.todos.splice(this.deletingIndex, 1)
        },
    },
    mounted: function () {
        // Runs updateTime() every 10 seconds to keep the time in the date picker fairly up to date
        this.dateTime = setInterval(() => {
            this.updateTime()
        }, 10000)
    },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&display=swap');
:root {
    --clr-primary: #cfe0c3;
    --clr-secondary: #9ec1a3;
    --clr-text: #ffffff;
    --clr-text-placeholder: #e6e6e6;
    --clr-accent-light: #50ddc8;
    --clr-accent-darker: #52c9b7;
    --clr-accent-darkest: #1f363d;
}

html {
    font-size: 62.5%;
    scroll-behavior: smooth;
}

body {
    background-color: var(--clr-primary);
}

* {
    font-family: 'Josefin Sans', sans-serif;
}

/** Form section styles */
.c-form__container input {
    padding: 2rem 2rem;
    background-color: var(--clr-secondary);
    outline-color: var(--clr-primary);
    outline-style: solid;
    color: var(--clr-text);
    font-size: 1.5rem;
    line-height: 1;
}

.c-form__container input::placeholder {
    color: var(--clr-primary);
}

.c-form__container:focus-within {
    max-height: 278px;
}

.c-form__radio-container input {
    appearance: none;
    width: 100%;
    height: 5rem;
    display: grid;
    place-content: center;
    cursor: pointer;
}

.c-form__radio-container input::after {
    content: url('https://api.iconify.design/eva/checkmark-circle-outline.svg?color=white');
    scale: 0;
    rotate: 180deg;
    opacity: 0;
    transition: ease-in-out 0.25s;
    margin-top: 5px;
}

.c-form__radio-container input:checked::after {
    scale: 2;
    rotate: 0deg;
    opacity: 1;
}

.c-form__deadline-input::selection {
    background-color: transparent;
}

.c-form__deadline-input::after {
    content: url('https://api.iconify.design/akar-icons/calendar.svg?color=white');
}

.c-form__deadline-input::-webkit-calendar-picker-indicator {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    color: transparent;
    background: transparent;
}

.c-form__submit-btn {
    box-shadow: inset 0px 1px 8px 3px var(--clr-secondary);
}

.c-form__submit-btn.isActive {
    box-shadow: inset 0px 0px 8px 30px var(--clr-secondary);
    color: var(--clr-text);
}

/** Todo section styles */
.c-delete-prompt {
    background-color: var(--clr-primary);
    box-shadow: inset 0px 0px 10px 0px var(--clr-accent-darkest);
}

.c-delete-prompt button {
    background-color: var(--clr-secondary);
}

.t-fade-up-enter-active,
.t-fade-up-leave-active {
    transition: all 0.3s;
}

.t-fade-up-enter,
.t-fade-up-leave-to {
    opacity: 0;
    transform: translate(-50%, 50%);
}

.c-todo-filter__button-container button {
    background-color: var(--clr-secondary);
}

.fade-from-left {
    animation: fade-from-left 0.5s ease-out;
}

@keyframes fade-from-left {
    0% {
        opacity: 0;
        transform: translateX(-25%);
    }
    100% {
        opacity: 1;
        transform: translateX(0%);
    }
}

.scale-out {
    animation: scale-out 0.5s ease-in;
    animation-delay: 0.25s;
}

@keyframes scale-out {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    60% {
        transform: scale(1.1);
    }
    100% {
        opacity: 0;
        transform: scale(0);
    }
}
</style>
