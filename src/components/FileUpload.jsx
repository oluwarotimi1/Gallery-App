import React, {useState, useEffect } from 'react';
import {storage, db} from "../firebase/config";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {doc, setDoc, collection, getDocs} from "firebase/firestore"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './fileupload.css'

const FileUpload = () => {

    const [file, setFile] = useState("");
    const [error, setError] = useState(null);
    const [uploadProgress, setuploadProgress] = useState(0);
    const [images, setImages] = useState([])

    //React Js pop variables here

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    const openModal = () => setOpen(true);
    const [loading, setLoading] = useState(false);

    const types = ["image/jpeg", "image/png"];

    const handleChange =(event)=>{

        let selected = event.target.files[0];
        if(selected && types.includes(selected.type) ){
            setFile(selected)
            setError("")
        }else{
            setFile("")
        setError("Please select an image type (png,jpeg)");
        }
        
    }

    // THIS RUNS ANYTIME WE LOAD

    useEffect(()=>{
        loadAllImages();
    },[])

    // LET'S LOAD ALL IMAGES HERE

    const loadAllImages = async () =>{
        setLoading(true)
        const querySnapshot = await getDocs(collection (db, "images"));
        let currImages = [];
        querySnapshot.forEach((doc)=>{
            currImages = [...currImages, doc.data().imageUrl];
        });
        setImages(currImages);
        setLoading(false)
    } 


    const handleUpload =()=>{
        
        const storageRef = ref(storage, `images/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) =>{
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100
            setuploadProgress(progress);
        },
        (error)=>{
            console.log(error)   
        },
        () =>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                console.log("download url:", downloadURL);
                const imageStoreRef = doc(db, 'images', file.name);
                setDoc(imageStoreRef, {
                    imageUrl: downloadURL
                })
            });
        }
        )
    }

  return (
    <div className="container">
        
        <div className="loading-container">
            {loading && <p className='loading-gallery'>Loading Gallery...</p>}
            
        </div>
        
        <div className='images-collection'>
        
        {
            images
            &&
            images.map((imageUrl)=>{
                return(
                    <div className='image-container'>
                    <img  src={imageUrl}/>
                    </div>
                )
                
            })
        }
      <button onClick={openModal}>Upload an Image</button>
      <Popup open={open} onClose={closeModal}>
        <input type="file" accept="/image/*" onChange={handleChange}></input>
      <button onClick={handleUpload}>Save</button>
      {error&& <div className="error">{error}</div>}
      <button type="button" className="button" onClick={() => setOpen(o => !o)}>
        Controlled Popup
      </button>
      </Popup>
    </div>
    </div>
    
  )
}

export default FileUpload
