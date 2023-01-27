import { useUserAuth } from '@/hooks/useUserAuth';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { logger } from '@/util/logger';
import { ContentPopup } from '@/components/ContentPopup';
import { EditProfile } from '@/components/Profile/EditProfile';
import { ProfileProps } from '@/types/Profile/ProfileProps';
import { imgCompressor } from '@/util/imgCompressor';

function ProfilePage({ ...props }: ProfileProps) {
  // Logout
  const authenticationHook = useUserAuth();
  // Change Picture
  const [profilePic, setProfilePic] = useState<any>(null);
  const [pPicMessage, setPPicMessage] = useState<{
    message: string;
    err: boolean;
  }>({ message: '', err: false });
  const placeholderImage: string = 'assets/ProfilePictureDefault.png';
  // props
  const [localProps, setLocalProps] = useState<{
    username: string;
    fname: string;
    lname: string;
    email: string;
    pic: string | null;
  }>({
    username: props.username,
    fname: props.fname,
    lname: props.lname,
    email: props.email,
    pic: props.pic,
  });
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);

  async function handlePictureInputChange(e: any) {
    if (
      e === undefined ||
      e.target.files === undefined ||
      e.target.files[0] === undefined
    ) {
      return;
    }

    if (e.target.files[0].size > 3145720) {
      logger.log('file too big');
      setProfilePic('SizeError');
      setPPicMessage({ message: 'File is too big!', err: true });
      return;
    }

    logger.log(e.target.files[0]);

    if (e.target.files.length > 1) {
      logger.log('You can only upload one Picture!');
      setPPicMessage({
        message: 'You can only upload one Picture!',
        err: true,
      });
      return;
    }

    const compressedImage = await imgCompressor(e.target.files[0]);

    if (compressedImage.size > 2097152) {
      logger.log('file too big', compressedImage.size);
      setProfilePic('SizeError');
      setPPicMessage({ message: 'File is too big!', err: true });
      return;
    }

    setProfilePic(compressedImage);
    setPPicMessage({ message: 'Picture saved in clipboard.', err: false });
  }

  async function uploadProfilePic() {
    let form_data = new FormData();
    console.log('profilePic: ', profilePic);
    form_data.append('file', profilePic);
    console.log('formdata: ', form_data);

    return await axios
      .put('/api/user/pfp/set', form_data)
      .then((_res: any) => {
        setProfilePic(null);
        setPPicMessage({ message: '', err: false });
        logger.log('Success');
        // return Promise.resolve(res.data);
      })
      .catch((_err: any) => {
        setProfilePic(null);
        setPPicMessage({ message: '', err: false });
        logger.log('Error');
        // return Promise.reject(err.response.data);
      });
  }

  return (
    <main
      id={'profile_page_' + localProps.username}
      className="relative w-full h-[calc(100vh-56px)] flex justify-center items-center text-white lg:mt-14"
    >
      <div
        id="profile-wrapper"
        className="w-full h-full flex flex-col justify-start items-center"
      >
        <section
          id="header-section"
          className="w-full flex flex-col justify-start items-center"
        >
          <h1 className="py-14 text-4xl">
            Welcome{' '}
            <span className="text-bright-seaweed">{localProps.username}</span>!
          </h1>
          <div className="relative flex flex-col justify-center items-center">
            <div
              id="img-container"
              className="relative flex-auto w-48 min-w-[10rem] max-w-[14rem] h-48 min-h-[10rem] max-h-[14rem]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  localProps.pic === null || localProps.pic === ''
                    ? placeholderImage
                    : 'https://cherrytomaten.herokuapp.com' + localProps.pic
                }
                alt="Profilbild"
                className="rounded-full"
              />
            </div>
            <div
              id="btns-container"
              className="flex flex-row justify-center items-center transition-all"
            >
              <input
                type="file"
                id="upload-profile-pic-btn"
                name="profile-pic-upload"
                title="Upload Profile Picture"
                className="hidden"
                accept="image/*"
                onChange={handlePictureInputChange}
              />
              <label
                htmlFor="upload-profile-pic-btn"
                className="mq-hover:hover:bg-dark-seaweed px-2 py-1 mt-4 text-default-font border-solid border-2 rounded-lg border-dark-seaweed transition-all cursor-pointer"
              >
                Upload Picture
              </label>
              {profilePic !== null && !pPicMessage.err && (
                <>
                  <div className="w-5 h-full"></div>
                  <button
                    type="submit"
                    id="submit-profile-pic-btn"
                    title="Submit Profile Picture"
                    className="mq-hover:hover:text-dark-sea mq-hover:hover:bg-bright-seaweed px-2 py-1 mt-4 text-default-font border-solid border-2 rounded-lg border-bright-seaweed transition-all"
                    onClick={uploadProfilePic}
                  >
                    Submit Picture
                  </button>
                </>
              )}
            </div>
            {profilePic !== null && (
              <div className="absolute top-full max-w-[264px] pt-2 text-center">
                <p
                  className={`${
                    pPicMessage.err ? 'text-danger' : 'text-bright-seaweed'
                  }`}
                >
                  {pPicMessage.message}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2 */}
        <section
          id="settings-section"
          className="w-full max-w-[430px] flex flex-col justify-center items-center mt-16 mb-12 bg-darker-sea"
        >
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Firstname</p>
            <p className="text-bright-seaweed">
              {localProps.fname === '' ? 'No Information' : localProps.fname}
            </p>
          </div>
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Lastname</p>
            <p className="text-bright-seaweed">
              {localProps.lname === '' ? 'No Information' : localProps.lname}
            </p>
          </div>
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>E-Mail</p>
            <p className="text-bright-seaweed">
              {localProps.email === '' ? 'No Information' : localProps.email}
            </p>
          </div>

          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Profile Information</p>
            <button
              type="button"
              id="change-profile-details-btn"
              title="Change Password"
              className="mq-hover:hover:bg-lighter-sea min-w-[80px] px-2 py-1 ml-4 text-default-font border-solid border-2 rounded-lg border-lighter-sea transition-all"
              onClick={() => setShowEditPopup(!showEditPopup)}
            >
              Edit Profile
            </button>
          </div>

          <ContentPopup
            trigger={showEditPopup}
            setTrigger={setShowEditPopup}
            bgColor="bg-darker-sea"
          >
            <EditProfile
              fname={localProps.fname}
              lname={localProps.lname}
              username={localProps.username}
              email={localProps.email}
              setLocalProps={setLocalProps}
              localProps={localProps}
            />
          </ContentPopup>

          {/* LOGOUT */}
          <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
            <p>Logout</p>
            <Link href="/">
              <button
                type="button"
                id="logout-btn"
                title="Logout"
                onClick={() => authenticationHook.logout()}
                className="mq-hover:hover:bg-lighter-danger mq-hover:hover:border-lighter-danger min-w-[80px] px-2 py-1 text-default-font bg-danger border-solid border-2 rounded-lg border-danger transition-all"
              >
                Logout
              </button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export { ProfilePage };



// {
//   /* OPTIONS - commented to save */
// }
// <div className="w-full h-14 flex flex-row justify-between items-center px-6 border-b-2 border-dark-sea">
//   <p>Option 1</p>
//   <input id="check-1" type="checkbox" name="check" className="peer hidden" />
//   <label
//     htmlFor="check-1"
//     className="peer-checked:bg-bright-seaweed peer-checked:shadow-shadow-inset-thin-darker-sea peer-checked:before:translate-x-[24px] peer-checked:before:bg-default-font relative w-[3.3rem] h-7 block bg-lighter-sea rounded-2xl transition-all cursor-pointer before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:block before:bg-darker-sea before:rounded-full before:transition-all"
//   ></label>
// </div>
