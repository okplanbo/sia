import { useCallback, useState } from "react";

import { Paper, Tooltip, FormControlLabel, Checkbox, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Typography, LinearProgress,
    Button, useMediaQuery, Box } from "@mui/material";

import { useTheme } from '@mui/material/styles';

import { basicList, storage_key, tooptip_offset, total_percent } from ":src/constants";

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
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    const updateTasks = (newTasks: Task[]) => {
        localStorage.setItem(storage_key, JSON.stringify(newTasks));
        setTasks(newTasks);
        setProgress(calcProgress(newTasks));
    }

    const toggleTask = useCallback((index: number) => {
        const newTasks = [...tasks];
        newTasks[index] = {...newTasks[index], checked: !newTasks[index].checked};
        updateTasks(newTasks);
    }, [tasks]);

    const handleRestart = useCallback(() => {
        const newTasks = initialTasks;
        updateTasks(newTasks);
        setOpen(false);
    }, []);

    const handleDialogOpen = () => {
        setOpen(true);
    };
    
    const handleDialogClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Typography variant="h2" component="h1" align="center">
                <Tooltip
                    title="is Georgian for 'List'"
                    placement="top"
                    enterTouchDelay={0}
                    PopperProps={{
                        modifiers: [
                            {
                                name: "offset",
                                options: {
                                    offset: tooptip_offset,
                                },
                            },
                        ],
                    }}
                >
                    <Box sx={{ userSelect: 'none' }}>
                        Sia*
                    </Box>
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
            <Box display="flex" justifyContent="center" marginTop="2rem">
                <Button variant="outlined" onClick={handleDialogOpen}>Restart</Button>
            </Box>
            <LinearProgress variant="determinate" value={progress} className="progress" />
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleDialogClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Good morning, dear!
                </DialogTitle>
                <DialogContent sx={{ minWidth: '400px '}}>
                    <DialogContentText>
                        Are you ready to start a new day?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleDialogClose}>
                        False alarm
                    </Button>
                    <Button onClick={handleRestart} variant="contained" autoFocus>
                        Yes, I&#39;m awesome!
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}