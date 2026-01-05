import './Profile.css';
import { useState } from 'react';
import assets from '../../assets/assets/assets';
import { uploadImage } from '../../uploadImage';
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const { profile, updateProfile, loading } = useUser();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(profile?.avatar || assets.avatar_icon);
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    let imageUrl = preview;

    if (image) {
      imageUrl = await uploadImage(image);
    }

    await updateProfile(name, bio, imageUrl);
    alert('Profile saved successfully!');
    navigate('/chat');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="profile">
      <div className="profile-container">
        {loading ? (
          <h3>Loading profile...</h3>
        ) : (
          <form onSubmit={handleUpload}>
            <h3>Profile Details</h3>

            <label htmlFor="avatar">
              <input type="file" id="avatar" hidden onChange={handleImageChange} />
              <img src={preview} alt="avatar" />
              Upload profile image
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your bio"
              required
            ></textarea>

            <button type="submit">Save</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
