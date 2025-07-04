// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ImageUploadUpdate = ({ masterId }) => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [logoUrl, setLogoUrl] = useState("");

//   useEffect(() => {
//      // Fetch the current logo URL when the component mounts
//      const fetchLogo = async () => {
//        try {
//          const response = await axios.get(`/api/masterlogobill/${masterId}`);
//          setLogoUrl(response.data.logo_url);
//        } catch (error) {
//          console.error("Error fetching logo:", error);
//        }
//      };
 
//      fetchLogo();
//    }, [masterId]);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleSubmit = async (event) => {
//      event.preventDefault();
 
//      if (!file) {
//        setMessage("Please select a file to upload.");
//        return;
//      }
 
//      const formData = new FormData();
//      formData.append("logo", file);
 
//      try {
//        const response = await axios.post(`/api/masterlogobill/${masterId}/update`, formData, {
//          headers: {
//            "Content-Type": "multipart/form-data",
//          },
//        });
 
//        setMessage(response.data.message);
//        setLogoUrl(response.data.data.logo_url);
//        setFile(null);
//      } catch (error) {
//        setMessage("Failed to upload and update the image. Please try again.");
//      }
//    };

//   return (
//     <div>
//       <h2>Update Logo</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Current Logo:</label>
//           {logoUrl ? (
//             <img src={logoUrl} alt="Current Logo" width="200" />
//           ) : (
//             <p>No logo available</p>
//           )}
//         </div>
//         <div>
//           <input type="file" onChange={handleFileChange} accept="image/*" />
//         </div>
//         <button type="submit">Upload</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ImageUploadUpdate;
