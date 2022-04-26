import React from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { makeStyles, Toolbar, Typography, Dialog, AppBar, Button, Divider, Avatar, Paper, TextField, InputAdornment } from "@material-ui/core";
import { useAddPostDialogStyles } from '../../styles';
import { ArrowBackIos, PinDrop } from '@material-ui/icons';
import { UserContext } from '../../App';
import serialize from '../../utils/serialize';
import handleImageUpload from '../../utils/handleImageUpload';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_POST } from '../../graphql/mutations';
import { useHistory } from 'react-router-dom';



const initialValue = [
    {
        type: "paragraph",
        children: [{ text: "" }]
    }
];


const AddPostDialog = ({ media, handleClose }) => {
    const history = useHistory();
    const { me, currentUserId } = React.useContext(UserContext);
    const classes = useAddPostDialogStyles();
    const editor = React.useMemo(() => withReact(createEditor()), []);
    const [value, setValue] = React.useState(initialValue);
    const [location, setLocation] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [createPost] = useMutation(CREATE_POST);

    console.log(media);

    function handleSharePost() {
        setIsSubmitting(true);
        handleImageUpload({
            user: me,
            media,
            actionType: "SHARE_POST",
            gqlFunction: createPost,
            postData: {
                userId: currentUserId,
                location,
                caption: serialize({ children: value }),
            },
            history,
        });
        setIsSubmitting(false);
    }

    return (
        <Dialog fullScreen open onClose={handleClose}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <ArrowBackIos onClick={handleClose} />
                    <Typography align='center' variant='body1' className={classes.title}>
                        New Post
                    </Typography>
                    <Button
                        color="primary"
                        className={classes.share}
                        disabled={isSubmitting}
                        onClick={handleSharePost}
                    >
                        Share
                    </Button>
                </Toolbar>
            </AppBar>
            <Divider />
            <Paper className={classes.paper}>
                <Avatar src={me.profile_image} />
                <Slate editor={editor} value={value} onChange={value => setValue(value)} >
                    <Editable
                        className={classes.editor}
                        placeholder="Write your caption"
                    />
                </Slate>
                <Avatar
                    src={URL.createObjectURL(media)}
                    className={classes.avatarLarge}
                    variant="square"
                    sx={{ width: 80, height: 80 }}
                />
            </Paper>
            <TextField
                fullWidth
                placeholder='Location'
                InputProps={{
                    classes: {
                        root: classes.root,
                        input: classes.input,
                        underline: classes.underline
                    },
                    startAdornment: (
                        <InputAdornment>
                            <PinDrop />
                        </InputAdornment>
                    )
                }}
                onChange={event => setLocation(event.target.value)}
            />
        </Dialog>
    )
}

export default AddPostDialog;