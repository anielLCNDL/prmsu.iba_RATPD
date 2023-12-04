const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const filesDirectory = 'files/';
const adminUsername = 'adminRATPD';
const adminPassword = 'prmsucoeadminRATPD';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


function getDestination(req, file, cb) {
  const course = req.body.course || 'UnknownCourse';
  const paperType = req.body.paperType || 'UnknownType';
  const destination = path.join(filesDirectory, course, paperType);
  
  // Ensure the destination directory exists
  fs.mkdirSync(destination, { recursive: true });

  console.log('Destination Directory:', destination);

  cb(null, destination);
}


// Set up the file upload storage
const storage = multer.diskStorage({
  destination: getDestination,
  filename: function (req, file, cb) {
    // Construct the filename with the selected course and type of paper
    const filename = file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Function to list all files in the 'files/' directory
function listAllFiles(callback) {
  fs.readdir(filesDirectory, { withFileTypes: true }, (err, courses) => {
    if (err) {
      console.error('Error reading courses:', err);
      callback([]);
    } else {
      const allFiles = [];
      courses.forEach(course => {
        if (course.isDirectory()) {
          const coursePath = path.join(filesDirectory, course.name);
          fs.readdirSync(coursePath, { withFileTypes: true }).forEach(paperType => {
            if (paperType.isDirectory()) {
              const paperTypePath = path.join(coursePath, paperType.name);
              const files = fs.readdirSync(paperTypePath).map(file => path.join(course.name, paperType.name, file));
              allFiles.push(...files);
            }
          });
        }
      });
      callback(allFiles);
    }
  });
}

// Function to delete a file
function deleteFile(filePath, callback) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      callback(false);
    } else {
      console.log('File deleted:', filePath);
      callback(true);
    }
  });
}

app.use('/images', express.static('C:\\Users\\Aniel Madelyn\\OneDrive\\Desktop\\TRY'));

 // Middleware to parse form data
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RATPD Database</title>
      <style>
          body {
              margin: 0;
              font-family: Arial, sans-serif;
          }
  
          #container {
              display: flex;
              height: 1.25in;
          }
  
          #left-panel,
          #right-panel {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
          }
  
          #left-panel {
             flex: 2.5; /* 70% */
              background-image: url('/images/istockphoto-1255440608-2048x2048.jpg');
              background-size: 100% 100%;
              color: white;
              text-align: center; /* Center text */
          }
  
          #right-panel {
            flex: 1.5; /* 30% */ 
            background-image: url('/images/istockphoto-1255440608-2048x2048.jpg');
            background-size: 100% 100%;
              color: white;
              font-family: 'Times New Roman', Times, serif;
              position: relative;
          }
  
          #menu-button {
              cursor: pointer;
              position: absolute;
              top: 10px;
              right: 10px;
              background-color: #001f3f;
              color: white;
              padding: 10px;
              border: none;
              border-radius: 5px;
          }
  
          #menu {
              display: none;
              position: absolute;
              top: 50px;
              right: 10px;
              background-color: #001f3f;
              width: 20%;
              margin-top: 20px;
              padding: 10px;
              box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
              z-index: 2;
          }
  
          #menu a {
              color: white;
              padding: 10px 16px;
              text-decoration: none;
              display: block;
          }
  
          #menu a:hover {
              background-color: #003366;
          }
  
          @media only screen and (max-width: 600px) {
              #container {
                  flex-direction: column;
              }
  
              #left-panel,
              #right-panel {
                  width: 100%;
                  align-items: center;
              }
          }
  
          #left-panel div {
              font-family: 'Baskerville', serif;
              font-size: 30px;
              font-weight: bold;
          }
          #login-form {
            display: flex;
            flex-direction: column;
            align-items: center; /* Center login form */
        }
    
        
            #additional-panel {
              height: 50%;
              width: 100%;
              position: absolute;
              top: 1.25in;
              background-image: url('/images/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9530.jpg');
             background-size: 100% 100%;
               font-family: 'Times New Roman', Times, serif; /* Set font for right panel */
             color: white;
            z-index: 1;
          }
  
          /* Add the following styles for the search results */
    #search-panel {
        overflow-y: auto;
        max-height: 200px; /* Set the maximum height for the list, adjust as needed */
        max-width: 500px;
    }

    #search-results {
        overflow-y: auto;
        max-height: inherit;
    }

    #search-results ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    #search-results li {
        margin-bottom: 5px;
    }
    
         #searchForm label {
    width: 30%;
    margin-top: 35px;
    margin-left: 5px;
    height: 30px;
}

#searchForm #title {
    width: 25%;
    margin-top: 35px;
    margin-left: 5px;
    height: 30px;
}

#searchForm #courseLabel {
    width: 10%;
    margin-left: 5px;
    margin-top: 5px;
    height: 20px;
}

#searchForm #course {
    width: 10%;
    margin-left: 50px;
    margin-top: 5px;
    height: 20px;
}

#searchForm #paperTypeLabel {
    width: 10%;
    margin-left: 5px;
    margin-top: 5px;
    height: 20px;
}

#searchForm #paperType {
    width: 10%;
    margin-left: 5px;
    margin-top: 5px;
    height: 20px;
}

#searchForm button {
    width: 5%;
    margin-left: 107px;
    height: 20px;
    margin-top: 5px;
}

/* Customize the scrollbar color */
#search-results::-webkit-scrollbar {
    width: 12px; /* Adjust the width as needed */
}

#search-results::-webkit-scrollbar-thumb {
    background-color: #000000; /* Set the scrollbar thumb color to black */
}   


#new-panel {
  height: 4in;
  width: 100%;
  background-color: #ecf0f1; /* Cloud-like light background color */
  color: #34495e; /* Dark blue text color for contrast */
  border-top: 10px solid #1e6091; /* Dark blue border on top */
  border-bottom: 10px solid #1e6091; /* Dark blue border on top */
  position: absolute;
  top:66%;
  font-family: 'Times New Roman', Times, serif; /* Set font for right panel */
 color: white;
}

#new-panel-text {
  font-size: 20px;
  font-weight: bold;
  color: black;
  margin-top: 30px;
    margin-left: 5px;
}

/* Add this CSS for the modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin-top: 210px;
      height: 50%; /* Adjust the height as needed */
      overflow-y: auto; 
   margin-left:20%;
    padding: 20px;
    border: 1px solid #888;
    width: 50%;
    background-image: url('/images/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9530.jpg');
            background-size: 100% 100%;
               font-family: 'Times New Roman', Times, serif; /* Set font for right panel */
             color: white;

}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
#help-modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

#help-modal .modal-content {
  background-color: #fefefe;
  margin-top: 210px;
  height: 50%; /* Adjust the height as needed */
  overflow-y: auto;
  margin-left: 20%;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  background-image: url('/images/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9530.jpg');
  background-size: 100% 100%;
  font-family: 'Times New Roman', Times, serif;
  color: white;
}

#help-modal .close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

#help-modal .close:hover,
#help-modal .close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
/* Style for More Info modal */
#more-info-modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

#more-info-modal .modal-content {
  background-color: #fefefe;
  margin-top: 210px;
  height: 50%; /* Adjust the height as needed */
  overflow-y: auto;
  margin-left: 20%;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  background-image: url('/images/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9530.jpg');
  background-size: 100% 100%;
  font-family: 'Times New Roman', Times, serif; /* Set font for right panel */
  color: white;
 
  
}


#more-info-modal .close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

#more-info-modal .close:hover,
#more-info-modal .close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}


.circle-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.team-member {
  margin-bottom: 20px; /* Add spacing between team members */
  display: flex;
  align-items: center;
}

.team-member-photo {
  border-radius: 50%;
  overflow: hidden;
  width: 110px; /* Adjust photo size */
  height: 110px; /* Adjust photo size */
  margin-left: 40px;
}

.team-member-details {
  flex-grow: 1;
  margin-left:80px;
}

.team-member-details p {
  margin: 5px 0; /* Add spacing between paragraphs */
}
      </style>
  </head>
  
  <body>
      <div id="container">
          <div id="left-panel">
              <div style="text-align: center;">
                  <div>PRESIDENT RAMON MAGSAYSAY STATE UNIVERSITY</div>
                  <div>RESEARCH AND THESIS PROJECT DATABASE</div>
              </div>
          </div>
  
          <div id="right-panel">
              <div id="login-form">
              <div>Administrator Log In</div>
                  <form action="/admin-authenticate" method="post">
                      <label for="username">Username:</label>
                      <input type="text" id="username" name="username" required>
                      <br>
                      <label for="password">Password :</label>
                      <input type="password" id="password" name="password" required>
                      <br>
                      <button type="submit">Login</button>
                  </form>
              </div>
              <button id="menu-button">Menu</button>
              <div id="menu">
              <a href="#" id="help-link" onclick="openHelpModal()">Help</a>

                  <a href="#" id="about-link" onclick="showAbout()">About</a>

                  <a href="#" id="more-info-link" onclick="showMoreInfo()">More Info</a>
              </div>
          </div>
  
          <!-- Student Search Panel -->
          <div id="additional-panel">
              <!-- New additional panel with background image -->
              <form action="/search" method="post" id="searchForm">
                  <label for="title">Title:</label>
                  <input type="text" id="title" name="title">
                  <br>
                  <label for="course">Course:</label>
                  <select id="course" name="course">
                      <option value="">All Courses</option>
                      <option value="BSCE">BSCE</option>
                      <option value="BSCPE">BSCPE</option>
                      <option value="BSEE">BSEE</option>
                      <option value="BSME">BSME</option>
                  </select>
                  <br>
                  <label for="paperType">Type of Paper:</label>
                  <select id="paperType" name="paperType">
                      <option value="">All Types</option>
                      <option value="Research">Research</option>
                      <option value="Thesis">Thesis</option>
                  </select>
                  <br>
                  <button type="submit">Search</button>
              </form>
  
              <!-- Display the search results here -->
              <div id="search-panel">
                  <div id="search-content">
                      <div id="search-results">
                          <!-- Results will be inserted here via JavaScript -->
                      </div>
                  </div>
              </div>
          </div>
    
  
          <!-- New Panel with Cloud Background -->
          <div id="new-panel">
            <div id="pdf-cover"></div>
            <div>
              <div id="new-panel-text">Sample Papers:</div>
              
            </div>
          </div>
          
          
      
      <script>
          // JavaScript to toggle the menu visibility and handle form submission
          const menuButton = document.getElementById('menu-button');
          const menu = document.getElementById('menu');
          const searchForm = document.getElementById('searchForm');
          const searchResults = document.getElementById('search-results');
          const blackPanel = document.getElementById('black-panel');
  
          menuButton.addEventListener('click', function () {
              menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
          });
  
          searchForm.addEventListener('submit', function (event) {
              event.preventDefault();
  
              // Fetch and display search results
              fetch('/search', {
                      method: 'POST',
                      body: new URLSearchParams(new FormData(searchForm)),
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                      },
                  })
                  .then(response => response.text())
                  .then(html => {
                      searchResults.innerHTML = html;
                      blackPanel.style.display = 'block'; // Show the black panel with search results
                  })
                  .catch(error => console.error('Error fetching search results:', error));
          });
      </script>
      <!-- ... Your existing HTML code ... -->

      <!-- Modal for About section -->
      <div id="about-modal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="closeAboutModal()">&times;</span>
          <!-- Add this div within your modal content -->
         
              <h2>Introduction</h2>
              <p>In today's world, universities and colleges are increasingly reliant on technology to improve the efficiency and effectiveness of their operations. One area where technology can be particularly beneficial is in the management of student research papers and thesis projects.</p>
          <p>Currently, the College of Engineering at President Ramon Magsaysay State University (PRMSU) does not have a centralized and easily accessible database for storing and showcasing student research papers and thesis projects. This makes it difficult for students to find and cite the work of their peers, for faculty to track the research output of their students, and for the college to promote the research accomplishments of its students to the wider academic community.</p>
          <p>The proposed College of Engineering Research and Thesis Project Database will address this challenge by providing a centralized and user-friendly platform for storing and showcasing student research papers and thesis projects. The database will be accessible to both students and faculty, and will allow users to easily search for, view, download, and cite research papers and thesis projects.</p>
          <p> The database will also provide a number of features that will benefit both students and faculty. For example, students will be able to use the database to find and cite relevant research papers and thesis projects for their own research projects. Faculty will be able to use the database to track the research output of their students. The college will be able to use the database to promote the research accomplishments of its students to the wider academic community.</p>   
          <h2>Problem Description</h2>
              <p>In the College of Engineering at President Ramon Magsaysay State University (PRMSU), students and faculty currently face challenges in finding and accessing student research papers and thesis projects. This is due to the lack of a centralized and easily accessible database...</p>
          
              <h2>Evidence</h2>
              <ul>
                <li>Students and faculty have reported difficulty in finding and accessing student research papers and thesis projects.</li>
                <li>Students have reported difficulty in citing the work of their peers.</li>
                <li>Faculty have reported difficulty in tracking the research output of their students.</li>
              </ul>
          
              <h2>Project Goal</h2>
              <ul>
                <li>Centralization: Create a centralized database where all student research papers and thesis projects in the College of Engineering can be readily accessed and well organized.</li>
                <li>Visibility: Enhance the visibility of the students’ works and will allow users to easily search for, view, download, and cite research papers and thesis projects.</li>
                <li>Comprehensive Information: Support the inclusion of metadata, such as the title, author(s), abstract, keywords, and publication date, for each research paper and thesis project.</li>
                <li>Engagement: Encourage engagement among students, faculty, and alumni by highlighting student achievements and promoting collaboration and feedback.</li>
              </ul>
          
              <h2>Project Objectives</h2>
              <ul>
                <li>Database Development: Design and develop a user-friendly, responsive database specifically tailored to store and showcase student research papers and thesis projects.</li>
                <li>Content Management: Implement an intuitive content management system that permits a single authorized administrator to upload research paper and thesis project details using a known password.</li>
                <li>Project Submissions: Enable both students and faculty to submit their research papers and thesis projects for inclusion in the database.</li>
                <li>Search and Filter Functionality: Establish robust search and filter capabilities to enable users to easily locate specific research papers and thesis projects.</li>
                <li>Public and Internal Access: Ensure that the database is accessible to every engineering departments and their respective faculties, with appropriate access controls in place.</li>

              </ul>
            </div>
          </div>
          
      <!-- JavaScript code for modal -->
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          const aboutLink = document.getElementById('about-link');
          const aboutModal = document.getElementById('about-modal');
      
          aboutLink.addEventListener('click', function (event) {
            event.preventDefault();
            aboutModal.style.display = 'block';
          });
      
          window.onclick = function (event) {
            if (event.target === aboutModal) {
              aboutModal.style.display = 'none';
            }
          };
        });
      
        function closeAboutModal() {
          const aboutModal = document.getElementById('about-modal');
          aboutModal.style.display = 'none';
        }
      </script>
      <!-- Modal for Help section -->
      <div id="help-modal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
          <span class="close" onclick="closeHelpModal()">&times;</span>
          <div id="scrolling-content">
          <h2>Need Help?</h2>

          <p><strong>Question: Q1</strong></p>
          <p><strong>Why is the College of Engineering at PRMSU considering the development of a centralized database for student research papers and thesis projects?</strong></p>
          <p><strong>Answer:</strong> The College of Engineering at PRMSU is considering the development of a centralized database to address existing challenges faced by students and faculty. Currently, there is no easily accessible database, making it difficult for both students and faculty to find, access, and cite research papers and thesis projects. This lack of centralized information affects the overall efficiency in tracking student research output and promoting achievements within the academic community. The proposed database aims to overcome these challenges by providing a user-friendly platform for storing, showcasing, and accessing research papers and thesis projects.</p>
    
          <p><strong>Question: Q2</strong></p>
          <p><strong>What benefits will the proposed College of Engineering Research and Thesis Project Database provide to students and faculty?</strong></p>
          <p><strong>Answer:</strong> The proposed database will offer several benefits to both students and faculty. Students will be able to utilize the database to find and cite relevant research papers and thesis projects for their own research. Faculty, on the other hand, will have the capability to track the research output of their students more efficiently. Additionally, the database will enhance the visibility of students' works by providing a centralized platform for easy search, view, download, and citation of research papers and thesis projects. This increased visibility is expected to encourage collaboration, engagement, and feedback among students, faculty, and alumni.</p>
    
          <p><strong>Question: Q3</strong></p>
          <p><strong>What specific features are expected to be incorporated into the College of Engineering Research and Thesis Project Database?</strong></p>
          <p><strong>Answer:</strong> The database is planned to include various features to enhance its functionality. These features include the ability to store comprehensive metadata for each research paper and thesis project, such as title, author(s), abstract, keywords, and publication date. The system will be designed to be user-friendly and responsive, ensuring ease of use for both students and faculty. Robust search and filter capabilities will be established, enabling users to easily locate specific research papers and thesis projects. Moreover, the database will facilitate project submissions, allowing students and faculty to contribute their research papers and thesis projects for inclusion.</p>
    
          <p><strong>Question: Q4</strong></p>
          <p><strong>How will the College of Engineering ensure that the proposed database is accessible to relevant stakeholders while maintaining appropriate access controls?</strong></p>
          <p><strong>Answer:</strong> To ensure accessibility, the College of Engineering will implement a system where the database is accessible to every engineering department and their respective faculties. Access controls will be put in place to manage and restrict access based on authorization levels. The database will be designed to allow public and internal access, ensuring that relevant stakeholders, including students, faculty, and alumni, can benefit from the centralized platform. The goal is to strike a balance between openness and security, enabling the sharing of information while maintaining the confidentiality and integrity of the data.</p>
    
          <h2>Tutorial: How to Use Our Website for Research Papers and Thesis Projects</h2>
          <ol>
            <li><strong>Accessing the Website:</strong> To begin your research journey, open our website in your preferred web browser. The homepage welcomes you with a user-friendly interface designed to streamline your experience in finding relevant research papers and thesis projects.</li>
            <li><strong>Keyword Entry:</strong> At the top of the page, you'll notice a title text box. Here, enter keywords related to your research topic. These keywords could be specific terms, phrases, or topics you are interested in exploring. Precision in your keyword selection will yield more accurate and tailored search results.</li>
            <li><strong>Course Selection:</strong> To further refine your search, choose your specific course from the dropdown menu. The available courses include BSCE (Civil Engineering), BSCPE (Computer Engineering), BSEE (Electrical Engineering), and BSME (Mechanical Engineering). Selecting your course ensures that the results align with the specific field of your academic interest.</li>
            <li><strong>Type of Paper Selection:</strong> Next, specify the type of paper you are looking for by choosing between "Research" and "Thesis" from the dropdown menu. This selection narrows down the search to either academic research papers or comprehensive thesis projects, depending on your academic requirements.</li>
            <li><strong>Initiating the Search:</strong> Once you've entered your keywords and made your course and paper type selections, click the "Search" button. Our website will process your request, and within moments, you will be presented with a list of relevant research papers and thesis projects based on your criteria.</li>
            <li><strong>Browsing Search Results:</strong> Explore the search results displayed on the page. Each entry will include essential details such as the title, author(s), abstract, keywords, and publication date. This information allows you to quickly assess the relevance of each paper or thesis to your research needs.</li>
            <li><strong>Viewing and Downloading:</strong> Click on the titles of the papers or the provided links to view detailed information. You can preview the content and, if the paper meets your requirements, download it for further reference. The download option ensures you have easy access to valuable academic resources for your studies.</li>
            <li><strong>Sample Papers for Reference:</strong> Additionally, we provide sample papers for each course and type to assist you in understanding the format and content expected in academic papers. Feel free to explore these samples as they can serve as valuable references for your own research and thesis writing.</li>
          </ol>
        </div>
      </div>
    </div>
   
      
      <!-- JavaScript code for modal -->
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          const helpLink = document.getElementById('help-link');
          const helpModal = document.getElementById('help-modal');
      
          helpLink.addEventListener('click', function (event) {
            event.preventDefault();
            helpModal.style.display = 'block';
          });
      
          window.onclick = function (event) {
            if (event.target === helpModal) {
              helpModal.style.display = 'none';
            }
          };
        });
      
        function closeHelpModal() {
          const helpModal = document.getElementById('help-modal');
          helpModal.style.display = 'none';
        }
      </script>
      
      <!-- More Info modal -->
      <div id="more-info-modal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
          <span class="close" onclick="closeMoreInfoModal()">&times;</span>
          <div id="scrolling-content">
            <h2>Research And Web Development Team</h2>
      
            <!-- Administrator - Engr. Clarisse Hope Rico -->
            <div class="team-member">
              <div class="team-member-photo circle-photo">
                <img src="/images/Admin.jpg" alt="Administrator Photo">
              </div>
              <div class="team-member-details">
                <p>Administrator</p>
                <p>Head of Research Department</p>
                <p>Engr. Clarisse Hope Rico</p>
              </div>
            </div>
      
            
      
            <!-- Web Developer/Designer - Aniel Madelyn Lacandili -->
<div class="team-member">
  <div class="team-member-photo circle-photo">
    <img src="/images/Lacandili.jpg" alt="Web Developer Photo">
  </div>
  <div class="team-member-details">
    <p>Web Developer/Designer</p>
    <p>Aniel Madelyn Lacandili</p>
  </div>
</div>

<!-- Web Developer/Designer - Babylyn del Rosario -->
<div class="team-member">
  <div class="team-member-photo circle-photo">
    <img src="/images/delRosario.jpg" alt="Web Developer Photo">
  </div>
  <div class="team-member-details">
    <p>Web Developer/Designer</p>
    <p>Babylyn del Rosario</p>
  </div>
</div>

<!-- Creator/Researcher - Arianne Mae Fabros -->
<div class="team-member">
  <div class="team-member-photo circle-photo">
    <img src="/images/Fabros.jpg" alt="Researcher Photo">
  </div>
  <div class="team-member-details">
    <p>Creator/Researcher</p>
    <p>Arianne Mae Fabros</p>
  </div>
</div>

<!-- Creator/Researcher - Aira Elorde -->
<div class="team-member">
  <div class="team-member-photo circle-photo">
    <img src="/images/Elorde.jpg" alt="Researcher Photo">
  </div>
  <div class="team-member-details">
    <p>Creator/Researcher</p>
    <p>Aira Elorde</p>
  </div>
</div>

          </div>
        </div>
      </div>
      
      <!-- JavaScript code for More Info modal -->
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          const moreInfoLink = document.getElementById('more-info-link');
          const moreInfoModal = document.getElementById('more-info-modal');
      
          moreInfoLink.addEventListener('click', function (event) {
            event.preventDefault();
            moreInfoModal.style.display = 'block';
          });
      
          window.onclick = function (event) {
            if (event.target === moreInfoModal) {
              moreInfoModal.style.display = 'none';
            }
          };
        });
      
        function closeMoreInfoModal() {
          const moreInfoModal = document.getElementById('more-info-modal');
          moreInfoModal.style.display = 'none';
        }
      </script>
      

  </body>
  
  </html>
  
  `;

  res.send(html);
});

// Function to filter files based on search criteria
function filterFiles(searchCriteria, callback) {
  listAllFiles(files => {
    const filteredFiles = files.filter(file => {
      const fileName = file.toLowerCase();
      const title = searchCriteria.title.toLowerCase();
      const course = searchCriteria.course.toLowerCase();
      const paperType = searchCriteria.paperType.toLowerCase();

      return fileName.includes(title) && (course === '' || fileName.includes(course)) && (paperType === '' || fileName.includes(paperType));
    });

    callback(filteredFiles);
  });
}


app.post('/search', (req, res) => {
  const searchCriteria = {
    title: req.body.title || '',
    course: req.body.course || '',
    paperType: req.body.paperType || '',
  };

  filterFiles(searchCriteria, results => {
    const fileLinks = results.map(file => `
      <li>
        <a href="/files/${file}" target="_blank">${file}</a>
      </li>`
    );
    const fileList = fileLinks.length > 0 ? `<ul>${fileLinks.join('')}</ul>` : 'No matching files found.';

    const studentSearchResultsHtml = `
      <div id="search-results">
        <p>Search Results:</p>
        ${fileList}
      </div>
    `;

    res.send(studentSearchResultsHtml);
  });
});






// Serve HTML file with file upload form and list of all files for administrator
app.get('/admin', (req, res) => {
  listAllFiles(files => {
    const fileLinks = files.map(file => `
      <li>
        <a href="/files/${file}" target="_blank">${file}</a>
        <form action="/delete" method="post" style="display:inline;">
          <input type="hidden" name="fileToDelete" value="${file}">
          <button type="submit">Delete</button>
        </form>
      </li>`
    );
    const fileList = fileLinks.length > 0 ? `<ul>${fileLinks.join('')}</ul>` : 'No files available.';
    
    const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RATPD Database</title>
      <style>
          body {
              margin: 0;
              font-family: Arial, sans-serif;
          }
  
          #container {
              display: flex;
              height: 1.25in;
          }
  
          #left-panel,
          #right-panel {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
          }
  
          #left-panel {
             flex: 3.5; /* 70% */
              background-image: url('/images/istockphoto-1255440608-2048x2048.jpg');
              background-size: 100% 100%;
              color: white;
              text-align: center; /* Center text */
          }
  
          #right-panel {
            flex: 1.5; /* 30% */ 
            background-image: url('/images/istockphoto-1255440608-2048x2048.jpg');
            background-size: 100% 100%;
              color: white;
              font-family: 'Times New Roman', Times, serif;
              position: relative;
          }
  
         
          @media only screen and (max-width: 600px) {
              #container {
                  flex-direction: column;
              }
  
              #left-panel,
              #right-panel {
                  width: 100%;
                  align-items: center;
              }
          }
  
          #left-panel div {
              font-family: 'Baskerville', serif;
              font-size: 30px;
              font-weight: bold;
          }
          #logout-button {
            background-color: #001f3f; /* Dark blue background color */
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-weight: bold; /* Make the text bold */
            text-transform: uppercase; /* Convert the text to uppercase */
            cursor: pointer;
        }
        
        /* Add a hover effect to make it visually interactive */
        #logout-button:hover {
            background-color: #003366; /* Darker blue on hover */
        }
        
    
        
        #additional-panel {
          height: 85%;
          width: 50%;
          position: absolute;
          top: 1.25in;
          right: 0; /* Align to the right side of the screen */
          background-image: url('/images/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9530.jpg');
          background-size: 100% 100%;
          border-bottom: 18px solid #1e6091; /* Dark blue border on top */
          font-family: 'Times New Roman', Times, serif;
          color: white;
          z-index: 1;
      }
  
          /* Add the following styles for the search results */
    #search-panel {
        overflow-y: auto;
        max-height: 300px; /* Set the maximum height for the list, adjust as needed */
        max-width: 500px;
    }

    #search-results {
        overflow-y: auto;
        max-height: inherit;
    }

    #search-results ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    #search-results li {
        margin-bottom: 5px;
    }
    
         #searchForm label {
    width: 30%;
    margin-top: 35px;
    margin-left: 5px;
    height: 30px;
}

#searchForm #title {
    width: 40%;
    margin-top: 10px;
    margin-left: 5px;
    height: 30px;
}

#searchForm #courseLabel {
    width: 10%;
    margin-left: 5px;
    margin-top: 5px;
    height: 20px;
}

#searchForm #course {
    width: 15%;
    margin-left: 50px;
    margin-top: 5px;
    height: 20px;
}

#searchForm #paperTypeLabel {
    width: 10%;
    margin-left: 5px;
    margin-top: 5px;
    height: 20px;
}

#searchForm #paperType {
    width: 15%;
    margin-left: 5px;
    margin-top: 5px;
    height: 20px;
}

#searchForm button {
    width: 8%;
    margin-left: 107px;
    height: 20px;
    margin-top: 5px;
}

/* Hide the scrollbar in search results */
#search-results::-webkit-scrollbar {
  width: 0;
}

/* Optional: Add a transparent border to maintain the layout */
#search-results {
  border: 0.25em solid transparent;
  box-sizing: border-box;
}
/* Hide the scrollbar */
.file-list-container::-webkit-scrollbar {
  width: 0;
}

/* Optional: Add a transparent border to maintain the layout */
.file-list-container {
  border: 0.25em solid transparent;
  box-sizing: border-box;
}


#new-panel {
  height: 85%;
  width: 50%;
  background-image: url('/images/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9530.jpg');
          background-size: 100% 100%;
  position: absolute;
  top: 1.25in;
  left: 0; /* Align to the left side of the screen */
  font-family: 'Times New Roman', Times, serif;
  color: white;
  border-bottom: 18px solid #1e6091; /* Dark blue border on top */
}

#new-panel-text {
  font-size: 20px;
  font-weight: bold;
  color: black;
  margin-top: 30px;
  margin-left: 5px;
}


      </style>
  </head>
  
  <body>
      <div id="container">
          <div id="left-panel">
              <div style="text-align: center;">
                  <div>PRESIDENT RAMON MAGSAYSAY STATE UNIVERSITY</div>
                  <div>RESEARCH AND THESIS PROJECT DATABASE</div>
              </div>
          </div>
          <div id="right-panel">
          <div id="logout-form">
              <button id="logout-button">Log out</button>
          </div>
      </div>
      
      <script>
          document.addEventListener('DOMContentLoaded', function () {
              // Function to show confirmation dialog
              function confirmLogout() {
                  return confirm("Are you sure you want to log out?");
              }
      
              // Function to handle logout button click
              function handleLogout() {
                  if (confirmLogout()) {
                      // If user clicks 'Yes', redirect to the main page
                      window.location.href = "/logout"; // Change to "/logout" for the logout route
                  }
              }
      
              // Attach the handleLogout function to the click event of the logout button
              document.getElementById('logout-button').addEventListener('click', handleLogout);
          });
      </script>
      
      
             
      <!-- Additional Panel with Search Form and Results -->
      <div id="additional-panel">
      <h2>RATPD</h2>
          <form action="/search" method="post" id="searchForm">
              <label for="title">Title:</label>
              <input type="text" id="title" name="title">
              <br>
              <label for="course">Course:</label>
              <select id="course" name="course">
                  <option value="">All Courses</option>
                  <option value="BSCE">BSCE</option>
                  <option value="BSCPE">BSCPE</option>
                  <option value="BSEE">BSEE</option>
                  <option value="BSME">BSME</option>
              </select>
              <br>
              <label for="paperType">Type of Paper:</label>
              <select id="paperType" name="paperType">
                  <option value="">All Types</option>
                  <option value="Research">Research</option>
                  <option value="Thesis">Thesis</option>
              </select>
              <br>
              <button type="button" id="searchButton">Search</button>
          </form>

          <!-- Display the search results here -->
          <div id="search-panel">
              <div id="search-content">
                  <div id="search-results">
                      <!-- Results will be inserted here via JavaScript -->
                  </div>
              </div>
          </div>
      </div>

      <!-- New Panel with File Upload Form -->
<div id="new-panel">
<h2>RATPD</h2>
  <form action="/upload" method="post" enctype="multipart/form-data">
    <div>
      <label for="course">Course:</label>
      <select id="course" name="course" style="width: 15%; margin-left: 50px; margin-top: 2px; height: 20px;">
      <option value=" "> </option>
        <option value="BSCE">BSCE</option>
        <option value="BSCPE">BSCPE</option>
        <option value="BSEE">BSEE</option>
        <option value="BSME">BSME</option>
      </select>
    </div>
    <div>
      <label for="paperType">Type of Paper:</label>
      <select id="paperType" name="paperType" style="width: 15%; margin-left: 5px; margin-top: 5px; height: 20px;">
      <option value="  "> </option>
      <option value="Thesis">Thesis</option>
        <option value="Research">Research</option>
      </select>
    </div>
    <div>
      <label for="file" style="width: 10%; margin-left: 5px; margin-top: 5px; height: 20px;">Choose File :</label>
      <input type="file" name="file" id="file" style="width: 40%; margin-left: 10px; margin-top: 5px; height: 20px;">
    </div>
    <br>
    <input type="submit" value="Upload" style="width: 8%; margin-left: 107px; height: 20px; margin-top: 0px;">
  </form>
  <br>
  <div class="file-list-container" style="max-height: 300px; overflow-y: auto;max-width: 600px;">
    <p style="margin: 10px">List of Uploaded Files:</p>
    ${fileList}
  </div>
</div>



<!-- Add the following script to your HTML file -->
      <script>
          // JavaScript to handle form submission and update search results in the additional panel
          document.addEventListener('DOMContentLoaded', function () {
              const searchForm = document.getElementById('searchForm');
              const searchResults = document.getElementById('search-results');
              const blackPanel = document.getElementById('black-panel');

              document.getElementById('searchButton').addEventListener('click', function () {
                  // Fetch and display search results
                  fetch('/search', {
                      method: 'POST',
                      body: new URLSearchParams(new FormData(searchForm)),
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                      },
                  })
                  .then(response => response.text())
                  .then(html => {
                      searchResults.innerHTML = html;
                      blackPanel.style.display = 'block'; // Show the black panel with search results
                  })
                  .catch(error => console.error('Error fetching search results:', error));
              });
          });
      </script>
  </body>

  </html>
  `;

  res.send(adminHtml);
});
});
// Serve uploaded files
app.use('/files', express.static('files'));

// Handle login
app.post('/login', (req, res) => {
  const userType = req.body.userType;
  if (userType === 'admin') {
    res.redirect('/admin-login');
  } else if (userType === 'student') {
    res.redirect('/student');
  } else {
    res.redirect('/');
  }
});



// Handle admin authentication
app.post('/admin-authenticate', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === adminUsername && password === adminPassword) {
    res.redirect('/admin');
  } else if (username !== adminUsername && password !== adminPassword) {
    res.send('Incorrect Password and Username');
  } else if (username !== adminUsername) {
    res.send('Incorrect Username');
  } else {
    res.send('Incorrect Password');
  }
});

// Handle file upload for administrator
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    console.log('File uploaded:', req.file.originalname);
    res.redirect('/admin');
  } else  {
    console.log('Please select a file.');
    res.send('Please select a file');
  }
});

app.post('/delete', (req, res) => {
  const fileToDelete = req.body.fileToDelete;
  const filePath = path.join(filesDirectory, fileToDelete);

  deleteFile(filePath, success => {
    if (success) {
      res.redirect('/admin');
    } else {
      res.status(500).send('File deletion failed.');
    }
  });
});



// Your existing route for the main page
app.get('/', (req, res) => {
  const html = `<div id="container">...</div>`;
  res.send(html);
});

// New route for logout
app.get('/logout', (req, res) => {
  // Perform any logout logic if needed

  // Redirect to the main page after logout
  res.redirect('/');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
