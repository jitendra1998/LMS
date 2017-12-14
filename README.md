## Learning Management System

A Learning Management System built with Django and ReactJS. This LMS allows content creators to develop courses with the web application and set course prices, give written or video lectures, and provide assessments to their students. Enrolled students will be able to engage with courses and receive the knowledge they so desire. As students progress through their courses, they'll be able to keep track of completed lessons, review content, and communicate with their classmates.

## Demo
[HouseOfHackers](http://houseofhackers.me)

## Screenshots
![LMS Screenshot](http://houseofhackers.me/media/assets/screenshot.png)

## Requirements
* Python 3.x
* Pip 9.x
* Django 1.11.x
* Node 7.9.0 or greater
* ReactJS 16+
* MySQL 5.7

## Getting Started
In order to begin developing and rolling out your own version of LMS, you will need to install packages for both the Django Back-End and the ReactJS Front-End. Creating the virtualenv and cloning this repo.

```
virtualenv venv
git clone https://github.com/Technopathic/LMS.git
```

You will then go ahead and activate the Virtual environment and install the Python packages using Pip.
```
source venv/bin/activate
cd LMS
pip install -R requirements.txt
```

Next we will update the Django Settings.py to reflect your own database credentials and migrate the models.
```
python manage.py migrate
```

For the Front-End, we'll go ahead and install the JavaScript packages using NPM (this may take a while).
```
npm install
```

Finally, you can start the development server for both the Back-End and the Front-End and being rolling out your own LMS.
```
python manage.py runserver
npm run start
```

## License
GNU/GPL 3.0
