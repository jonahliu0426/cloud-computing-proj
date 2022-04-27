import { useMutation } from "@apollo/client";
import { Person } from "@material-ui/icons";
import React from "react";
import { EDIT_USER_AVATAR } from "../../graphql/mutations";
import { useProfilePictureStyles } from "../../styles";
import handleImageUpload from "../../utils/handleImageUpload";

function ProfilePicture({
  user,
  size,
  isOwner,
  image = "https://reedbarger.nyc3.digitaloceanspaces.com/reactbootcamp/avatar.png"
}) {
  const classes = useProfilePictureStyles({ size, isOwner });
  const [img, setImg] = React.useState(image);
  const inputRef = React.useRef();
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  function openFileInput() {
    inputRef.current.click();
  }

  const handleUpdateProfilePic = async (event) => {
    await handleImageUpload({
      user,
      media: event.target.files[0],
      stateFunction: setImg,
      gqlFunction: editUserAvatar,
      actionType: 'UPLOAD_AVATAR'
    });
  }

  return (
    <section className={classes.section}>
      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        onChange={handleUpdateProfilePic}
      />
      {image ? (
        <div className={classes.wrapper}
          onClick={isOwner ? openFileInput : () => null}>
          <img src={user.profile_image} alt="user profile" className={classes.image} />
        </div>
      ) : (
        <div className={classes.wrapper}>
          <Person className={classes.person} />
        </div>
      )}
    </section>
  )
}

export default ProfilePicture;
