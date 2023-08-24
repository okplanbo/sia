import { useCallback, useState } from "react";

import { Paper, Tooltip, FormControlLabel, Checkbox, 
    Typography, LinearProgress, Button, Box } from "@mui/material";

import { basicList, storage_key, total_percent } from ":src/constants";

import "./App.scss";

type Task = {
    description: string;
    checked: boolean;
};

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

    const updateTasks = (newTasks: Task[]) => {
        localStorage.setItem(storage_key, JSON.stringify(newTasks));
        setTasks(newTasks);
        setProgress(calcProgress(newTasks));
    }

    const toggleTask = (index: number) => {
        const newTasks = [...tasks];
        newTasks[index] = {...newTasks[index], checked: !newTasks[index].checked};
        updateTasks(newTasks);
    };

    const restartHandler = useCallback(() => {
        const newTasks = initialTasks;
        updateTasks(newTasks);
    }, []);

    return (
        <>
            <Typography variant="h2" component="h1" align="center">
                <Tooltip
                    title="is Georgian for 'List'"
                    placement="right-start"
                >
                    <div>
                        Sia*
                    </div>
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
            <Box display="flex" justifyContent="center">
                <Button variant="outlined" sx={{fontWeight: 600}} onClick={restartHandler}>Restart the day</Button>
            </Box>
            <LinearProgress variant="determinate" value={progress} className="progress" />
        </>
    );
}