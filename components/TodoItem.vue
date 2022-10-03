<template>
    <li
        class="c-todo-item w-full max-h-[77px] p-8 pt-9 mt-4 mb-4 rounded-xl overflow-hidden relative flex flex-col transition-all duration-300"
        :class="{
            'c-todo-item--importance-green': importance.color === 'green',
            'c-todo-item--importance-yellow': importance.color === 'yellow',
            'c-todo-item--importance-red': importance.color === 'red',
            'max-h-80 translate-x-2 -translate-y-2 shadow-[-3px_3px_0px_2.5px_#1f363d]':
                isEditing,
            'max-h-80': isClicked,
        }"
    >
        <div
            class="c-todo-item__overlay absolute left-0 top-0 right-0 bottom-0 transition-opacity duration-300 z-50 pointer-events-none opacity-0 bg-black/50"
            :class="{ 'opacity-100': isChecked }"
        ></div>
        <div
            class="c-todo-item__header-container grid grid-cols-[4fr_0.5fr] gap-4 justify-between items-center"
        >
            <div
                class="c-todo-item__header-wrapper grid grid-cols-[2.4fr_1fr] gap-8 items-center"
                @click="() => toggleExpand()"
            >
                <h3
                    v-if="!isEditing"
                    class="c-todo-item__title text-left ml-1 text-3xl p-0 pt-2 font-bold"
                >
                    {{ title }}
                </h3>
                <input
                    v-else
                    type="text"
                    name="todoEditTitle"
                    class="c-todo-item__title-editing text-left ml-1 p-0 pt-2 text-3xl font-bold"
                    maxlength="25"
                    v-model="title"
                    @keyup.enter="() => submitEdit()"
                />
                <time
                    v-if="!isEditing"
                    class="c-todo-item__date text-xl justify-self-start mt-0.5"
                    >Due {{ date }}</time
                >
                <input
                    v-else
                    type="datetime-local"
                    name="editDeadline"
                    class="c-todo-item__date-editing relative p-[5px_6px_5.5px_0px]"
                    v-model="date"
                />
            </div>
            <div
                class="c-todo-item__checkbox-container grid place-items-center"
            >
                <div
                    class="c-todo-item__checkbox-wrapper grid justify-self-end place-items-center p-2"
                >
                    <input
                        type="checkbox"
                        name="todoCheckbox"
                        class="c-todo-item__checkbox relative w-9 h-9 border-2 appearance-none rounded-md border-white border-solid grid place-content-center cursor-pointer"
                        @click="() => toggleOverlay()"
                    />
                </div>
            </div>
        </div>
        <div class="c-todo-item__separation-line w-full h-0.5 my-4 mx-0"></div>
        <div
            class="c-todo-item__dropdown-container flex flex-row justify-between items-start"
        >
            <p
                v-if="!isEditing"
                class="c-todo-item__description w-3/4 text-left ml-1 text-lg h-36 pt-1"
            >
                {{ description }}
            </p>
            <textarea
                v-else
                type="text"
                name="todoEditDesc"
                class="c-todo-item__description-editing w-3/4 text-left ml-1 text-lg h-36 pt-1"
                maxlength="200"
                v-model="description"
                @keyup.enter="() => submitEdit()"
            />
            <div class="c-todo-item__button-container self-end">
                <div
                    class="c-todo-item__button-wrapper flex flex-row items-baseline justify-end"
                >
                    <input
                        type="checkbox"
                        name="todoEdit"
                        @click="() => submitEdit()"
                        class="c-todo-item__edit-checkbox p-2 pb-0 mr-1 relative w-9 h-9 border-2 appearance-none rounded-md border-white border-solid grid place-content-center cursor-pointer"
                    />
                    <button
                        class="c-todo-item__delete-btn p-2 pb-0 ml-4"
                        aria-label="Delete"
                        @click="() => $emit('remove')"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 448 512"
                            aria-hidden="true"
                        >
                            <path
                                fill="currentColor"
                                d="M160 400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm80 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm80 0c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16v208zm-2.5-375.06L354.2 80H424c13.3 0 24 10.75 24 24c0 13.3-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.18 0-80-35.8-80-80V128h-8c-13.25 0-24-10.7-24-24c0-13.25 10.75-24 24-24h69.82l36.68-55.06C140.9 9.357 158.4 0 177.1 0h93.8c18.7 0 36.2 9.358 46.6 24.94zM151.5 80h145l-19-28.44c-1.5-2.22-4-3.56-6.6-3.56h-93.8c-2.6 0-6 1.34-6.6 3.56L151.5 80zM80 432c0 17.7 14.33 32 32 32h224c17.7 0 32-14.3 32-32V128H80v304z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </li>
</template>

<script>
export default {
    name: 'TodoItem',

    props: ['title', 'description', 'importance', 'date'],

    data() {
        return {
            isEditing: false, // Value for toggling the editting mode of each todo
            isChecked: false, // Value for toggling the overlay of each todo when a todo is finished
            isClicked: false, // Value for checking is a todo item is clicked ( used for applting a class that expands it )
        }
    },

    methods: {
        toggleTodoEditing() {
            // Toggles the edit mode of each todo individually
            this.isEditing = !this.isEditing
        },
        submitEdit() {
            // Submit redigeret kode her..!
            this.toggleTodoEditing()
        },
        toggleOverlay() {
            // Toggles the overlay of each todo when clicking the "done" checkbox
            this.isChecked = !this.isChecked
        },
        toggleExpand() {
            this.isClicked = !this.isClicked
        },
    },
}
</script>

<style scoped>
.c-todo-item--importance-green {
    background: rgb(111, 200, 65);
    background: linear-gradient(
        90deg,
        rgba(111, 200, 65, 1) 0%,
        rgba(158, 193, 163, 1) 35%
    );
}

.c-todo-item--importance-yellow {
    background: rgb(197, 200, 65);
    background: linear-gradient(
        90deg,
        rgba(197, 200, 65, 0.8491771708683473) 0%,
        rgba(158, 193, 163, 1) 35%
    );
}

.c-todo-item--importance-red {
    background: rgb(200, 65, 65);
    background: linear-gradient(
        90deg,
        rgba(200, 65, 65, 0.8491771708683473) 0%,
        rgba(158, 193, 163, 1) 35%
    );
}

.c-todo-item__date-editing::-webkit-calendar-picker-indicator {
    cursor: pointer;
    position: absolute;
    padding: 0;
    width: 100%;
    height: 100%;
    color: transparent;
    background: transparent;
}

.c-todo-item__date-editing::after {
    content: url('https://api.iconify.design/akar-icons/calendar.svg?color=white');
    line-height: 0.5;
}

.c-todo-item__checkbox::before {
    position: absolute;
    content: '';
    width: 12px;
    height: 14px;
    background-color: var(--clr-secondary);
    right: -4px;
    top: -4px;
    border-radius: 50px;
}

.c-todo-item__checkbox::after {
    content: url('https://api.iconify.design/bi/check.svg?color=white');
    scale: 0;
    rotate: -45deg;
    opacity: 0;
    transition: ease-in-out 0.25s;
    margin: 6px -1px 0 0;
    pointer-events: none;
}

.c-todo-item__checkbox:checked::after {
    scale: 2.2;
    rotate: -12deg;
    opacity: 1;
    transform: translate(1px, 0.5px);
    cursor: pointer;
}

.c-todo-item__separation-line {
    background: radial-gradient(closest-side, var(--clr-primary), transparent);
}

.c-todo-item__title-editing,
.c-todo-item__description-editing,
.c-todo-item__date-editing {
    background: linear-gradient(90deg, transparent, var(--clr-primary));
}

.c-todo-item__edit-checkbox::before {
    position: absolute;
    content: '';
    width: 12px;
    height: 14px;
    background-color: var(--clr-secondary);
    right: -4px;
    top: -4px;
    border-radius: 50px;
}

.c-todo-item__edit-checkbox::after {
    content: url('https://api.iconify.design/humbleicons/pencil.svg?color=white');
    scale: 1.5;
    opacity: 1;
    transition: ease-in-out 0.25s;
    margin: 6px -1px 0 0;
    transform: translate(3.5px, -4.5px);
}

.c-todo-item__edit-checkbox:checked::after {
    animation: todo-edit-anim 0.5s;
}

@keyframes todo-edit-anim {
    0% {
        rotate: 0deg;
    }
    50% {
        rotate: 10deg;
    }
    100% {
        rotate: 0deg;
    }
}
</style>
