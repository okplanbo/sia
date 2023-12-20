import { useCallback, useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

import { Paper, Tooltip, FormControlLabel, Checkbox, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Typography, LinearProgress,
    Button, IconButton, useMediaQuery, Box, Input } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import DragIcon from '@mui/icons-material/DragIndicator';
import { useTheme } from '@mui/material/styles';

import { Task } from ":src/types";
import { calcProgress, debounce, reorder, vibrate } from ":src/helpers";
import { basicList, debounce_delay, storage_key, task_input_limit, tooptip_offset } from ":src/constants";

import "./App.scss";

function getInitialTasks() {
    const initialTasks: Task[] = basicList.map(description => {
        return { description, checked: false, key: uuidv4() }
    });
    initialTasks[0].checked = true;
    return initialTasks;
}

const saved_tasks = localStorage.getItem(storage_key);

export default function App(): JSX.Element {
    const [tasks, setTasks] = useState<Task[]>(saved_tasks ? JSON.parse(saved_tasks) : getInitialTasks());
    const [editedTasks, setEditedTasks] = useState<Task[]>([]);
    const [progress, setProgress] = useState(calcProgress(tasks));
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const addButtonRef = useRef<HTMLButtonElement>(null);
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
        vibrate();
    }, [tasks]);

    const debouncedUpdate = debounce((newDescription: string, key: string) => {
        const tasks = editedTasks.map(task => {
            if (task.key === key) {
                task.description = newDescription;
            }
            return task;
        });
        setEditedTasks(tasks);
    }, debounce_delay);

    const handleRestart = useCallback(() => {
        const newTasks = tasks.slice();
        newTasks.forEach(task => task.checked = false);
        updateTasks(newTasks);
        setIsConfirmOpen(false);
    }, [tasks]);

    const handleConfirmOpen = () => {
        setIsConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setIsConfirmOpen(false);
    };

    const handleStartEdit = () => {
        setEditedTasks(JSON.parse(JSON.stringify(tasks)));
        setIsEditDialogOpen(true);
    };

    const handleCancelEdit = () => {
        setIsEditDialogOpen(false);
    };

    const handleAddNewTask = () => {
        const newTasks = editedTasks.slice();
        newTasks.push({
            key: uuidv4(),
            description: '',
            checked: false
        });
        setEditedTasks(newTasks);
        addButtonRef.current?.scrollIntoView({behavior: 'smooth', inline: 'end' });
    };

    const handleSaveChanges = () => {
        setIsEditDialogOpen(false);
        const newTasks = editedTasks.filter(task => task.description);
        updateTasks(newTasks);
    };

    const handleTaskEdit = (value: string, key: string) => {
        debouncedUpdate(value, key);
    };

    const handleDeleteTask = (key: string) => {
        const tasks = editedTasks.filter(task => task.key !== key);
        setEditedTasks(tasks);
    };

    const onDragStart = () => {
        vibrate();
    }

    const handleClearTasks = () => {
        setEditedTasks([]);
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return; // dropped outside the list
        }
        if (result.destination.index === result.source.index) {
            return;
        }
        const items = reorder(
            editedTasks,
            result.source.index,
            result.destination.index,
        );
        setEditedTasks(items);
    }

    const EditableList = (
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {editedTasks.map((item, index) => (
                            <Draggable key={item.key} draggableId={item.key} index={index}>
                                {(provided) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        key={item.key} display="flex"
                                    >
                                        <Input
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                handleTaskEdit(event.target.value, item.key)
                                            }}
                                            defaultValue={item.description}
                                            fullWidth
                                            sx={{ marginBottom: "0.5rem" }}
                                            inputProps={{
                                                'aria-label': 'Task description',
                                                maxLength: task_input_limit
                                            }}
                                        />
                                        <IconButton
                                            aria-label="delete"
                                            size="medium"
                                            onClick={() => {
                                                handleDeleteTask(item.key)
                                            }}
                                        >
                                            <DeleteIcon fontSize="medium" />
                                        </IconButton>
                                        <IconButton
                                            aria-label="reorder"
                                            size="medium"
                                            {...provided.dragHandleProps}
                                        >
                                            <DragIcon fontSize="medium" />
                                        </IconButton>
                                    </Box>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );

    return (
        <>
            <Typography
                variant="h2"
                component="h1"
                align="center"
            >
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
            
            { tasks.length === 0 ? (
                <Typography
                    variant="h4"
                    component="h4"
                    align="center"
                    marginTop="2rem"
                >
                    It is so empty here... What&apos;s the plan? :)
                </Typography>
            ) : (
                <Paper variant="outlined" component="main">
                    {tasks.map((task, index) => (
                        <FormControlLabel
                            className="item"
                            key={task.key}
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
            )}

            <Box display="flex" justifyContent="center" marginTop="2rem">
                <Box display="flex" marginRight="2rem">
                    <Button variant="outlined" onClick={handleStartEdit}>
                        Edit
                    </Button>
                </Box>
                <Button variant="outlined" onClick={handleConfirmOpen}>
                    Restart
                </Button>
            </Box>

            <LinearProgress variant="determinate" value={progress} className="progress" />

            {/* Editing */}

            <Dialog
                fullScreen={fullScreen}
                open={isEditDialogOpen}
                onClose={handleCancelEdit}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    <Box display="flex" justifyContent="space-between">
                        Edit tasks
                        <Button
                            variant="outlined"
                            disabled={editedTasks.length === 0}
                            endIcon={<ClearIcon />}
                            onClick={handleClearTasks}
                        >
                            Clear all
                        </Button>
                    </Box>
                </DialogTitle>  
                <DialogContent sx={ fullScreen ? undefined : { minWidth: '500px'}}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        marginBottom="1rem"
                    >
                        { EditableList }
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                            ref={addButtonRef}
                            onClick={handleAddNewTask}
                        >
                            New task
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCancelEdit}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveChanges} variant="contained" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Restart Confirmation */}

            <Dialog
                fullScreen={fullScreen}
                open={isConfirmOpen}
                onClose={handleConfirmClose}
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
                    <Button autoFocus onClick={handleConfirmClose}>
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