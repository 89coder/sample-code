import {
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  Toast,
} from '@shopify/polaris';
import axios from 'axios';
import React, { useState, useCallback, useEffect } from 'react';

const Home = () => {
 const [files, setFiles] = useState([]);
  const [isLoading,setIsLoading] = useState(false)
  const [resMsg,setResMsg] = useState(false)
  const [isSuccess,setIsSuccess] = useState(false)
  const [totalFiles,setTotalFiles] = useState(0)

    const [activeToastMessage, setActiveToastMessage] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const toggleActive = useCallback(
    () => setActiveToastMessage((active) => !active),
    []
  );

  const HOST = process.env.HOST;
    const shopDomain = new URL(window.location).searchParams.get("shop");

  // const handleDropZoneDrop = useCallback(
  //   (_dropFiles, acceptedFiles) =>
  //     setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]),
  //   [],
  // );
  useEffect(()=>{
      const fetchFileCount = async() =>{
    try {
      const {data} = await axios.get(`${HOST}count-file?shop=${shopDomain}`)

      if(data.isSuccess){
      setTotalFiles(data?.fileCount)
      }
      else{
        setTotalFiles(data?.fileCount)
      }
    } catch (error) {
      console.error("Error in fetchFileCount",error)
    }
  }

    fetchFileCount()
  },[])




const handleDropZoneDrop = useCallback(
  (_dropFiles, acceptedFiles) => {
    setFiles((prevFiles) => {
      const totalFiles = prevFiles.length + acceptedFiles.length;
      if (totalFiles > 5) {
        setAlertMsg("File limit reached");

        // Clear alert after 1 second (1000 ms)
        setTimeout(() => {
          setAlertMsg('');
        }, 3000);

        return prevFiles;
      }
      return [...prevFiles, ...acceptedFiles];
    });
  },
  [],
);



  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: '0' }}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={window.URL.createObjectURL(file)}
            />
            <div>
              {file.name}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </LegacyStack>
        ))}
      </LegacyStack>
    </div>
  );

  const fileUpload = !files.length && <DropZone.FileUpload />;

  const handleUpload = async () => {
    try {
    console.log(totalFiles)

     if(totalFiles > 5){
      console.log("if check")
      setAlertMsg("You can not upload a maximum of 5 files.")

      setTimeout(() => {
          setAlertMsg('');
        }, 3000);

     }
     else{
   setIsLoading(true)
    console.log("else check")
      const formData = new FormData();

      // Append each file under the same field name
      files.forEach(file => {
        formData.append("uplaodFiles", file);
      });

      const {data} = await axios.post(`${HOST}upload-file?shop=${shopDomain}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if(data?.isSuccess){
    setResMsg(data?.msg)
    setIsSuccess(true)
    setIsLoading(false)
      }
      else{
    setResMsg(data?.msg)
    setIsSuccess(false)
    setIsLoading(false)
      }

        setTimeout(() => {
          setResMsg('');
        }, 3000);

     }
   
    } catch (error) {
      console.error("Error in handleUpload", error);
    }
  };


  return (
    <div className='drop_zone_container p-5'>
      <DropZone onDrop={handleDropZoneDrop}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>

   {alertMsg !== ""  && <Text variant="headingXl" as="h4">
       {alertMsg}
      </Text>}

      <button className="btn btn-dark btn-sm rounded-3 mt-3" onClick={handleUpload}>Upload</button>
      {isLoading ?<Text variant="headingXl" as="h4">
        Uploading...
      </Text> : 
      <>
      {isSuccess ?  <Text variant="headingXl" as="h4" tone="success">
       {resMsg}
      </Text> :<Text variant="headingXl" as="h4" tone="critical">
       {resMsg}
      </Text>}
      </>
    }

    </div>
  );
};

export default Home;
