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

function ProfileBalancePage({ history }) {
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
          case 1: {
            history.push('/accounts/balance')
          }
          default:
            break;
        }
      }
    
      const options = [
        "Edit Profile",
        "Wallet",
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
    
    const [balance, setBalance] = React.useState()
    if (loading) {
        return <LoadingScreen/>
    }
    fetch("https://lifjc152o5.execute-api.us-east-1.amazonaws.com/prod/user/balance/" + data.users_by_pk.name)
        .then(res => res.json())
        .then((res) => {
            setBalance(res.data)
        })

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
                {path.includes('balance') && <EditUserInfo user={data.users_by_pk} balance={balance}/>}
            </main>
            </section>
        </Layout>
    )
}

const DEFAULT_ERROR = { type: "", message: "" }

const EditUserInfo = ({ user, balance }) => {
  const classes = useEditProfilePageStyles();
  const [open, setOpen] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState(user.profile_image);
  console.log(user);

  function onSubmit() {
      var amount = document.getElementById("amount").value
      fetch("https://lifjc152o5.execute-api.us-east-1.amazonaws.com/prod/user/top-up/" + user.name + "/" + amount)
        .then(() => {
            window.location.reload(false)
        })
  }

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture user={user} size={45} image={profileImage} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
        </div>
      </div>

      <h3><center>Your Balance: {balance}</center></h3>
        Amount: 
        <input type="text" name="amount" id="amount"/>
        <button type="button" onClick={onSubmit}>Top up</button>
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


export default ProfileBalancePage