import React from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { IconButton, Hidden, Drawer, List, ListItem, ListItemText, Typography, TextField, Snackbar, Slide } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { Alert, Button } from "react-bootstrap"

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
    const [address, setAddress] = React.useState()
    const [privateKey, setPrivateKey] = React.useState()

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJraWQiOiJlQU41NzlZY0t2OWo5WGpCaXUrTVJqVlJxQ3pNdlpYUEtITEJqcE5tOHFnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlN2FmMmVmZS1mNjhhLTRlOGUtYWZmYi1lYWI2ZWQyYzk0YjYiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0YxSmxBcVNodiIsImNvZ25pdG86dXNlcm5hbWUiOiJseSIsIm9yaWdpbl9qdGkiOiJlNzQ1M2NiZS0zNzdhLTQ5NTktYTRiMi1mOTliNWRmOWI4MDciLCJhdWQiOiIydDRqNzQ5ZHRrM2JpZTI3OXNqZ3ZlYmdsYiIsImV2ZW50X2lkIjoiYmY0ZWI0MWEtMGJlZS00M2M4LWFhOGQtOGY3MjI1MGRjMTEzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NTI3NzA2OTMsImV4cCI6MTY1Mjg1NzA5MywiaWF0IjoxNjUyNzcwNjkzLCJqdGkiOiIwMDJjOWVjOC1mNjJjLTRiOTYtYTgwOS0wZjNjMjllN2FiMjgiLCJlbWFpbCI6Imxlb2VseWFuZ0BnbWFpbC5jb20ifQ.n8uTn3VyKS1PtiBKVcGtEVE0hy6kN_LN9G86V6f9wICWN4LlNFQhsalzT56TM5-_f9KV090BYv1AqTKh0I1gvxqMrLBBkm1iY8wxc_8B1_bE-8T2_W__4bsQn5BAY9aXJUYokKgLoUKYHYceNoQBEMZuZgF4G-SSh2OfwxpAwe2TgA2phPKSkIRPnVSOjfMya-YnE3kcRdnueUjzFQ6wfy3wbzT1wu_HKj_Q2_Km9jBn7faiB_PLTo9IEwfoIdlyh2iJUnhLNd8h6gBy9VrkTgh15cmQtl0Em8yNeOa09MzJ2ixLiTeeXvJKcRypZ-AkE96Az_WyYSVPtLBWNuQH5w");
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch("https://un76br25o9.execute-api.us-east-1.amazonaws.com/prod/account", requestOptions)
      .then(response => response.json())
      .then(result => {
        setBalance(result["balance"])
        setAddress(result["address"])
        setPrivateKey(result["privateKey"])
      })
      .catch(error => console.log('error', error));

    if (loading) {
        return <LoadingScreen/>
    }
    // fetch("https://lifjc152o5.execute-api.us-east-1.amazonaws.com/prod/user/balance/" + data.users_by_pk.name)
    //     .then(res => res.json())
    //     .then((res) => {
    //         setBalance(res.data)
    //     })

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
                {path.includes('balance') && <EditUserInfo user={data.users_by_pk} balance={balance} address={address} privateKey={privateKey}/>}
            </main>
            </section>
        </Layout>
    )
}

const DEFAULT_ERROR = { type: "", message: "" }

const EditUserInfo = ({ user, balance, address, privateKey }) => {
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

      <Alert variant="primary">
        Address: {address}
      </Alert>

      <Alert variant="primary">
        Balance (ETH): {balance}
      </Alert>

      <Alert variant="primary">
        Private Key: {privateKey}
      </Alert>

        {/* <b>Amount:</b> 
        <input type="text" name="amount" id="amount"/>
        <Button variant="success" onClick={onSubmit}>Top up</Button> */}
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