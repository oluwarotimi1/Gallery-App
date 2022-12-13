import React, {useState, useEffect } from 'react';
import {storage, db} from "../firebase/config";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {doc, setDoc, collection, getDocs} from "firebase/firestore"
import './fileupload.css'

const FileUpload = () => {

    const [file, setFile] = useState("");
    const [error, setError] = useState(null);
    const [uploadProgress, setuploadProgress] = useState(0);

    const types = ["image/jpeg", "image/png"];



    const handleChange =(event)=>{
        // setFile(event.target.files[0]) 
        let selected = event.target.files[0];
        if(selected == "" || types.includes(selected.type) ){
            setFile(selected)
            setError("")
        }else{
            setFile(null)
        setError("Please select an image type (png,jpeg)")
        }
    }

    // THIS RUNS ANYTIME WE LOAD

    useEffect(()=>{
        loadAllImages();
    },[])

    // LET'S LOAD ALL IMAGES HERE

    const loadAllImages = async () =>{
        const querySnapshot = await getDocs(collection (db, "images"));
        querySnapshot.forEach((doc)=>{
            console.log(doc.id, "=>", doc.data())
        })
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
    <div>
      <input type="file" accept="/image/*" onChange={handleChange} placeholder="Select Image" />
      <button onClick={handleUpload}>Upload</button>
      {error&& <span className="error">{error}</span> }
    </div>
  )
}

export default FileUpload
