import { useState } from "react";

import { Paper, Tooltip, FormControlLabel, Checkbox, 
    Typography, LinearProgress } from "@mui/material";

import "./App.scss";

type Task = {
    description: string;
    checked: boolean;
};

const basicList = [
    'Open to-do list',
    'Make a bed',
    'Brush teeth',
    'Wordle',
    'Stretch, push-ups',
    'Cold shower',
    'Glass of water',
    'Brush hair',
    'Breakfast',
    'Leetcode challenge',
    'Work smart, not hard',
    'Check exchange rates',
    'Finance management',
    'Eat a fruit',
    'Talk to a friend',
    'Tasty lunch',
    'Take a selfie',
    'Cardio 8\'000 steps',
    'Check email & reply',
    'Read an article, book',
    'Relax and rest',
    'Podcast',
    'Dinner',
    'Wash dishes',
    'Brush teeth before bed',
    '23:00 - go to sleep',
];

const total_percent = 100;
const storage_key = 'SIA_TASKS_STATE';

const initialTasks: Task[] = basicList.map(description => {
    return { description, checked: false }
});
initialTasks[0].checked = true;

const saved_tasks = localStorage.getItem(storage_key);

const calcProgress = (tasks: Task[]) => {
    let completedCount = 0;
    tasks.forEach(item => {
        if (item.checked) {
            completedCount++;
        }
    });
    return total_percent / basicList.length * completedCount;
}

export default function App(): JSX.Element {
    const [tasks, setTasks] = useState<Task[]>(saved_tasks ? JSON.parse(saved_tasks) : initialTasks);
    const [progress, setProgress] = useState(calcProgress(tasks));

    const toggleTask = (index: number) => {
        const newTasks = [...tasks];
        newTasks[index].checked = !newTasks[index].checked;
        localStorage.setItem(storage_key, JSON.stringify(newTasks));
        setTasks(newTasks);
        setProgress(calcProgress(newTasks));
    };

    return (
        <>
            <Typography variant="h2" component="h1" align="center">
                Sia
                <Tooltip title="is Georgian for 'List'">
                    <span className="star">
                        *
                    </span>
                </Tooltip>
            </Typography>
            <Paper variant="outlined" component="main">
                {tasks.map((task, index) => (
                    <FormControlLabel
                        className="item"
                        key={index}
                        label={task.description}
                        control={
                            <Checkbox
                                checked={task.checked}
                                onChange={() => toggleTask(index)}
                            />
                        }
                    />
                ))}
            </Paper>
            <LinearProgress variant="determinate" value={progress} className="progress" />
        </>
    );
}