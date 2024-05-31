**RITECS Full-Stack Application**
This project sets up a full-stack application with a React frontend, Django backend, and multi-container Docker deployment. The application is served via Nginx, with data managed through PostgreSQL and Redis.

**Prerequisites**
  Docker: Docker needs to be installed on your system.
  
**Docker Installation**
  - Windows and macOS
      1. Download Docker Desktop:
        Visit Docker's website and download Docker Desktop for your operating system.
      2. Install Docker Desktop:
        Run the installer and follow the on-screen instructions to complete the installation.
      3. Start Docker Desktop:
        Start Docker Desktop from the Start menu (Windows) or Applications folder (macOS).
      
  - Linux
    - Update your package index:

          sudo apt-get update
    - Install Docker's package dependencies:

          sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
    - Add Docker’s official GPG key:
    
          curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    - Add Docker’s APT repository:
    
          sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    - Update your package index again:
    
          sudo apt-get update
    - Install Docker CE:
    
          sudo apt-get install docker-ce
    - Install Docker Compose:
    
          sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '(?<=tag_name": "v)[^"]*')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
          sudo chmod +x /usr/local/bin/docker-compose
    - Verify Installation:
    
          docker --version
          docker-compose --version


**Installation and Setup**
  1. Clone the Repository:
     
    git clone https://github.com/ZorlinTesting/RITECS-fullstack.git
    cd RITECS-fullstack
  3. Copy and Configure .env.prod File:
    Copy the provided .env.prod file to the root directory of the project.
    Edit line 5 to set the MEDIA_PATH to the directory where your images will be stored.
    - Example:
     
    MEDIA_PATH=/path/to/your/media
  5. Start the Application:
     
    docker-compose --env-file ./.env.prod up -d
  7. Access the Application:
     - Local Machine: Open a browser and go to

           http://localhost
     - Local Network: Open a browser and go to

           http://<machine-ip>.
     - External Users: Open a browser and go to

           http://<public-ip> or the configured domain.
     
**Notes**
  - Ensure that the directory specified in MEDIA_PATH exists on your machine.
  - If you need to make changes to the MEDIA_PATH, you can edit the .env.prod file and restart the containers using the command above.
    
**Troubleshooting**
  - If you encounter any issues, please check the logs of the Docker containers for any error messages:

        docker-compose logs
  - For further assistance, please refer to the project's issues section on GitHub or consult the Docker documentation.
