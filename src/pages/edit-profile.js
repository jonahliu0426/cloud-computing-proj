import React from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { IconButton, Hidden, Drawer, List, ListItem, ListItemText, Typography, TextField, Button, Snackbar, Slide } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm } from 'react-hook-form';
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { EDIT_USER, EDIT_USER_AVATAR } from "../graphql/mutations";
import { AuthContext } from "../auth";
import handleImageUpload from "../utils/handleImageUpload";

function EditProfilePage({ history }) {
  const { currentUserId } = React.useContext(UserContext);
  const variables = { id: currentUserId }
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });
  const classes = useEditProfilePageStyles();
  const [showDrawer, setDrawer] = React.useState(false);
  const path = history.location.pathname;

  const handleToggleDrawer = () => {
    setDrawer(prev => !prev);
  }

  const handleSelected = (index) => {
    switch (index) {
      case 0: {
        return path.includes('edit');
      }
      default:
        break;
    }
  }

  const handleListClick = (index) => {
    switch (index) {
      case 0: {
        history.push('/accounts/edit');
        break;
      }
      default:
        break;
    }
  }

  const options = [
    "Edit Profile",
    "Change Password",
    "Apps and Websites",
    "Email and SMS",
    "Push Notification",
    "Manage Contacts",
    "Privacy and Security",
    "Login Activity",
    "Emails from Instagram",
  ];

  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton
          }}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  )

  if (loading) return <LoadingScreen />
  return (
    <Layout title="Edit Profile">
      <section className={classes.section}>
        <IconButton
          edge="start"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={{ paperAnchorLeft: classes.temporaryDrawer }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden
            xsDown
            implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes('edit') && <EditUserInfo user={data.users_by_pk} />}
        </main>


      </section>
    </Layout>
  )
}

const DEFAULT_ERROR = { type: "", message: "" }


const EditUserInfo = ({ user }) => {
  const { updateEmail } = React.useContext(AuthContext);
  const { register, handleSubmit } = useForm({ mode: 'onBlur' });
  const classes = useEditProfilePageStyles();
  const [editUser] = useMutation(EDIT_USER);
  const [error, setError] = React.useState(DEFAULT_ERROR);
  const [open, setOpen] = React.useState(false);
  // const [media, setMedia] = React.useState(null);
  const [profileImage, setProfileImage] = React.useState(user.profile_image);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR)
  const inputRef = React.useRef();
  console.log(user);

  function handleError(error) {
    console.log(error);
    if (error.message.includes("users_username_key")) {
      setError({
        type: "username",
        message: "This username is already taken.",
      });
    } else if (error.code.includes("auth")) {
      setError({ type: "email", message: error.message });
    }
  }

  async function onSubmit(data) {
    try {
      setError(DEFAULT_ERROR);
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      await editUser({ variables });
      setOpen(true);
    } catch (error) {
      console.error("Error updating profile", error);
      handleError(error);
    }
  }

  const handleUpdateProfilePic = async (event) => {
    await handleImageUpload({
      user,
      media: event.target.files[0],
      stateFunction: setProfileImage,
      gqlFunction: editUserAvatar,
      actionType: 'UPLOAD_AVATAR'
    });
  }

  const openFileInput = () => {
    inputRef.current.click();
  }

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture user={user} size={45} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <input
            accept="image/*"
            id="image"
            type="file"
            style={{ display: "none" }}
            ref={inputRef}
            onChange={handleUpdateProfilePic}
          />
          <label htmlFor="image">
            <Button onClick={openFileInput}>
              <Typography
                color="primary"
                variant="body2"
                className={classes.typography}
              >
                Change Profile Photo
              </Typography>
            </Button>
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <SectionItem name="name" inputRef={{
          ...register("name", {
            required: true,
            minLength: 5,
            maxLength: 20,
          })
        }} text="Name" formItem={user.name} />
        <SectionItem
          name="username"
          error={error}
          inputRef={{
            ...register("username", {
              required: true,
              pattern: /^[a-zA-Z0-9_.]*$/,
              minLength: 5,
              maxLength: 20,
            })
          }} text="Username" formItem={user.username} />
        <SectionItem name="website" inputRef={{
          ...register("website", {
            validate: (input) =>
              Boolean(input)
                ? isURL(input, {
                  protocols: ["http", "https"],
                  require_protocol: true,
                })
                : true,
          })
        }} text="Website" formItem={user.website} />
        <div className={classes.sectionItem} >
          <aside>
            <Typography className={classes.bio}>Bio</Typography>
          </aside>
          <TextField
            name="bio" {
            ...register("bio", {
              maxLength: 120,
            })
            }
            variant="outlined"
            multiline
            fullWidth
            maxRows={3}
            minRows={1}
            defaultValue={user.bio}
          />
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Typography color="textSecondary" className={classes.justifySelfStart}>
            Personal Information
          </Typography>
        </div>
        <SectionItem
          name="email"
          error={error}
          inputRef={{
            ...register("email", {
              required: true,
              validate: (input) => isEmail(input)
            })
          }} text="Email" formItem={user.email} />
        <SectionItem name="phoneNumber" inputRef={{
          ...register("phoneNumber", {
            validate: input => Boolean(input) ? isMobilePhone(input) : true,
          })
        }} text="Phone Number" formItem={user.phone_number} />
        <div className={classes.sectionItem}>
          <div />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            className={classes.justifySelfStart}
          >
            Submit
          </Button>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        TransitionComponent={Slide}
        message={<span>Profile updated</span>}
        onClose={() => setOpen(false)}
      />
    </section>
  )
}

const SectionItem = ({ type = "text", text, formItem, inputRef, name, error }) => {
  const classes = useEditProfilePageStyles();

  return (
    <div className={classes.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography className={classes.typography} align="right">
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={classes.typography} style={{ paddingTop: "1px" }}>
            {text}
          </Typography>
        </Hidden>
      </aside>
      <TextField
        name={name}
        variant="outlined"
        helperText={error?.type === name && error.message}
        {...inputRef}
        fullWidth
        defaultValue={formItem}
        type={type}
        className={classes.textField}
        inputProps={{
          className: classes.textFieldInput,
        }}
      />
    </div>
  )
}


export default EditProfilePage;
