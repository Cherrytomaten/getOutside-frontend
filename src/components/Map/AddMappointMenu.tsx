import { LatLngTuple } from "leaflet";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PinCategoriesList } from "@/types/Pins/PinCategories";
import { getPinCategories } from "@/services/pinCategoires";
import { AddPinProps } from "@/types/Pins/AddPinProps";
import { PinRepoClass } from "@/repos/PinRepo";
import { logger } from "@/util/logger";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { CloudImageProps } from "@/types/CloudImage";

type AddMappointMenuProps = {
  coords: LatLngTuple;
}

type AddMappointErrorProps = {
  title: string;
  description: string;
  category: string;
  address: string;
  image: string;
}

function AddMappointMenu({ coords }: AddMappointMenuProps) {
  const [formData, setFormData] = useState<AddPinProps>({
    title: "",
    category: "",
    address: "",
    desc: "",
    coords: coords,
    openingHours: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "" },
    images: null
  });
  const [formErrors, setFormErrors] = useState<AddMappointErrorProps>({ title: "", description: "", category: "", address: "", image: "" });
  const [pinCategories, setPinCategories] = useState<PinCategoriesList>([{ id: "" }]);
  const [serverError, setServerError] = useState<string>("");
  const [isUploadFinished, setIsUploadFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handlePictureInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e === undefined || e.target.files === undefined || e.target.files === null) {
      return;
    }

    if (e.target.files.length > 10) {
      setFormErrors({ ...formErrors, image: "The maximum of possible images is 10"})
      return;
    }
    setFormData({ ...formData, images: e.target.files });
  }

  function validateForm(): boolean {
    let validator: boolean = true;
    let data = formErrors;

    if (formData.title === "") {
      data = { ...data, title: "Please enter a title" };
      validator = false;
    } else {
      data = { ...data, title: "" };
    }

    if (formData.desc === "") {
      data = { ...data, description: "Please enter a description" };
      validator = false;
    } else {
      data = { ...data, description: "" };
    }

    if (formData.category === "") {
      data = { ...data, category: "Please select a category" };
      validator = false;
    } else {
      data = { ...data, category: "" };
    }

    if (formData.address === "") {
      data = { ...data, address: "Please enter an address" };
      validator = false;
    } else {
      data = { ...data, address: "" };
    }

    setFormErrors(data);
    return validator;
  }

  async function addImageToMappoint(url: string, pinId: string): Promise<void> {
    return await axios.post('/api/pins/add-image', {
      pinId: pinId,
      imageUrl: url
    })
      .then((_res) => {
        logger.log("added", url);
        return Promise.resolve();
      })
      .catch((_err) => {
        logger.log("failed to add image to mappoint with url", url);
        return Promise.resolve();
      })
  }

  async function uploadImages(files: FileList, pinId: string): Promise<void> {
    for(let i = 0; i < files.length; i++) {
      const form_data = new FormData();
      form_data.append('file', files[i]);
      form_data.append('upload_preset', 'profile_picture');

      await axios.post('/api/image-upload', form_data)
        .then(async (_res: AxiosResponse<CloudImageProps>) => {
          logger.log(`uploaded image in array pos ${i}`, _res.data.secure_url);
          await addImageToMappoint(_res.data.secure_url, pinId)
        })
        .catch((_err) => {
          logger.log("Failed to upload image in array position: " + i);
        })
    }

    return Promise.resolve();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (validateForm()) {
      //add mappoint
      setServerError("");
      setIsLoading(true);
      await PinRepoClass.AddMappoint(formData)
        .then(async (res) => {
          // add images if provided
          if (formData.images !== null) {
            await uploadImages(formData.images, res.uuid);
          }
          // finish process
          setIsLoading(false);
          setIsUploadFinished(true);
        })
        .catch((err: FetchServerErrorResponse) => {
          logger.log(err.errors.message);
          setServerError(err.errors.message);
          setIsLoading(false);
        })
    }

    return;
  }

  useEffect(() => {
    // get all possible categories on load
    getPinCategories()
      .then((res: PinCategoriesList) => {
        setPinCategories(res);
      });

    // clear form on load
    if (document) {
      const form: HTMLFormElement | undefined = document.getElementById("add-point-form") as HTMLFormElement;
      if (form !== undefined && form !== null) {
        form.reset();
      }
    }
  }, []);

  if (isUploadFinished) {
    return (
      <div className="hide-scrollbar w-full h-full flex flex-col justify-start items-center pt-20 overflow-y-scroll">
        <h3 className="mb-6 text-3xl text-center text-white">Mappoint was added successfully!</h3>
      </div>
    );
  }

  return (
    <div className="hide-scrollbar w-full h-full flex flex-col justify-start items-center pt-20 overflow-y-scroll">
      <h3 className="mb-6 text-5xl text-center text-white">Add mappoint</h3>
      <form id="add-point-form" className="flex-auto w-4/5 max-w-md flex flex-col justify-start items-center pb-10 xs:px-5" onSubmit={(e) => handleSubmit(e)}>
        <div
          className={`${
            formErrors.title !== '' ? 'mb-3' : ''
          } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}>
          <label htmlFor="add-pin-title" className="invisible w-0 h-0">
            Title
          </label>
          <input
            type="text"
            className={`${
              formErrors.title !== '' ? 'border-danger' : 'border-bright-seaweed hover:border-hovered-seaweed'
            } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
            onClick={() => setFormErrors({ ...formErrors, title: '' })}
            onFocus={() => setFormErrors({ ...formErrors, title: '' })}
            placeholder="Title*"
            id="add-pin-title"
          />
          <AnimatePresence>
            {formErrors.title !== '' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
                <p className="input-error-text mt-1 text-danger">{formErrors.title}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-full min-w-[220px] max-w-xs flex flex-col flex-wrap justify-center items-start py-3 mb-3 xs:w-full xs:flex-nowrap xs:justify-center">
          <label htmlFor="add-pin-category" className="invisible w-0 h-0">
            Category
          </label>
          <select
            id="add-pin-category"
            className={`w-full p-2 text-white bg-dark-seaweed/25 border-solid border-2 rounded-md cursor-pointer ${formErrors.category !== '' ? 'border-danger' : 'border-bright-seaweed'}`}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
            defaultValue={'select'}
            onClick={() => setFormErrors({ ...formErrors, category: '' })}
            onFocus={() => setFormErrors({ ...formErrors, category: '' })}>
            <option disabled={true} value="select">
              Select category*
            </option>
            {pinCategories.map((catElem: { id: string }) => {
              return (
                <option key={'cat-' + catElem.id} value={catElem.id}>
                  {catElem.id}
                </option>
              );
            })}
          </select>
          <AnimatePresence>
            {formErrors.category !== '' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
                <p className="input-error-text mt-1 text-danger">{formErrors.category}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={`${
            formErrors.address !== '' ? 'mb-3' : ''
          } w-full max-w-xs min-w-[220px] py-3 flex flex-col justify-center items-start flex-wrap xs:flex-nowrap xs:w-full xs:justify-center relative`}>
          <label htmlFor="add-pin-address" className="invisible w-0 h-0">
            Address
          </label>
          <input
            type="text"
            className={`${
              formErrors.address !== '' ? 'border-danger' : 'border-bright-seaweed hover:border-hovered-seaweed'
            } bg-transparent text-default-font border-b-2 border-solid w-full pt-2 pb-1 px-1 rounded-none appearance-none`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
            onClick={() => setFormErrors({ ...formErrors, address: '' })}
            onFocus={() => setFormErrors({ ...formErrors, address: '' })}
            placeholder="Address*"
            id="add-pin-address"
          />
          <AnimatePresence>
            {formErrors.address !== '' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
                <p className="input-error-text mt-1 text-danger">{formErrors.address}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-full min-w-[220px] max-w-xs flex flex-col flex-wrap justify-center items-start py-3 mt-2 xs:w-full xs:flex-nowrap xs:justify-center">
          <label htmlFor="add-pin-desc" className="invisible w-0 h-0">
            Description
          </label>
          <textarea
            placeholder="Description"
            rows={4}
            className={`w-full max-h-40 p-1 text-default-font bg-transparent border-solid border-2 rounded-md appearance-none ${formErrors.description ? 'border-danger' : 'border-bright-seaweed'}`}
            onClick={() => setFormErrors({ ...formErrors, description: '' })}
            onFocus={() => setFormErrors({ ...formErrors, description: '' })}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, desc: e.target.value })}
          />
          <AnimatePresence>
            {formErrors.description !== '' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
                <p className="input-error-text mt-1 text-danger">{formErrors.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-full min-w-[220px] max-w-xs flex flex-col flex-wrap justify-center items-start py-3 mb-3 xs:w-full xs:flex-nowrap xs:justify-center">
          <input
            type="file"
            id="add-pin-images"
            lang="en"
            multiple
            className="w-full text-white"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handlePictureInputChange(e)}
            onClick={() => setFormErrors({ ...formErrors, image: '' })}
          />
          <AnimatePresence>
            {formErrors.image !== '' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
                <p className="input-error-text mt-1 text-danger">{formErrors.image}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-full min-w-[220px] max-w-xs flex flex-col flex-wrap justify-center items-start py-3 mb-3 xs:w-full xs:flex-nowrap xs:justify-center">
          <h3 className="mb-1.5 text-lg text-white">Opening hours</h3>
          <label htmlFor="add-pin-oh-monday" className="invisible w-0 h-0">
            Monday
          </label>
          <input
            type="text"
            className="w-full px-1 pt-2 pb-1 text-default-font bg-transparent border-solid border-b-2 rounded-none border-bright-seaweed appearance-none hover:border-hovered-seaweed"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, openingHours: { ...formData.openingHours, monday: e.target.value } })}
            placeholder="Monday"
            id="add-pin-oh-monday"
          />
          <label htmlFor="add-pin-oh-tuesday" className="invisible w-0 h-0">
            Tuesday
          </label>
          <input
            type="text"
            className="w-full px-1 pt-2 pb-1 mt-5 text-default-font bg-transparent border-solid border-b-2 rounded-none border-bright-seaweed appearance-none hover:border-hovered-seaweed"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, openingHours: { ...formData.openingHours, tuesday: e.target.value } })}
            placeholder="Tuesday"
            id="add-pin-oh-tuesday"
          />
          <label htmlFor="add-pin-oh-wednesday" className="invisible w-0 h-0">
            Wednesday
          </label>
          <input
            type="text"
            className="w-full px-1 pt-2 pb-1 mt-5 text-default-font bg-transparent border-solid border-b-2 rounded-none border-bright-seaweed appearance-none hover:border-hovered-seaweed"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, openingHours: { ...formData.openingHours, wednesday: e.target.value } })}
            placeholder="Wednesday"
            id="add-pin-oh-wednesday"
          />
          <label htmlFor="add-pin-oh-thursday" className="invisible w-0 h-0">
            Thursday
          </label>
          <input
            type="text"
            className="w-full px-1 pt-2 pb-1 mt-5 text-default-font bg-transparent border-solid border-b-2 rounded-none border-bright-seaweed appearance-none hover:border-hovered-seaweed"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, openingHours: { ...formData.openingHours, thursday: e.target.value } })}
            placeholder="Thursday"
            id="add-pin-oh-thursday"
          />
          <label htmlFor="add-pin-oh-friday" className="invisible w-0 h-0">
            Friday
          </label>
          <input
            type="text"
            className="w-full px-1 pt-2 pb-1 mt-5 text-default-font bg-transparent border-solid border-b-2 rounded-none border-bright-seaweed appearance-none hover:border-hovered-seaweed"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, openingHours: { ...formData.openingHours, friday: e.target.value } })}
            placeholder="Friday"
            id="add-pin-oh-friday"
          />
          <label htmlFor="add-pin-oh-saturday" className="invisible w-0 h-0">
            Saturday
          </label>
          <input
            type="text"
            className="w-full px-1 pt-2 pb-1 mt-5 text-default-font bg-transparent border-solid border-b-2 rounded-none border-bright-seaweed appearance-none hover:border-hovered-seaweed"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, openingHours: { ...formData.openingHours, saturday: e.target.value } })}
            placeholder="Saturday"
            id="add-pin-oh-saturday"
          />
          <label htmlFor="add-pin-oh-sunday" className="invisible w-0 h-0">
            Sunday
          </label>
          <input
            type="text"
            className="w-full px-1 pt-2 pb-1 mt-5 text-default-font bg-transparent border-solid border-b-2 rounded-none border-bright-seaweed appearance-none hover:border-hovered-seaweed"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, openingHours: { ...formData.openingHours, sunday: e.target.value } })}
            placeholder="Sunday"
            id="add-pin-oh-sunday"
          />
        </div>

        <div className="w-full min-w-[220px] max-w-xs flex flex-col justify-center items-center mt-10">
          <input
            type="submit"
            value="Add point"
            id="login-btn-submit"
            className="mq-hover:hover:bg-hovered-seaweed w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer"
          />
        </div>
        <AnimatePresence>
          {serverError !== '' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }}>
              <p className="input-error-text mt-1 text-danger">{serverError}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export { AddMappointMenu };
