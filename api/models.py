from django.db import models
from imagekit.models import ImageSpecField
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill

class Profile(models.Model):
    userID = models.IntegerField(blank=False)
    name = models.CharField(max_length=255, blank=False)
    avatar_thumbnail = ProcessedImageField(upload_to='avatars', processors=[ResizeToFill(150, 150)], format='PNG')
    roleID = models.IntegerField(blank=False)
    stripe_id = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Role(models.Model):
    roleName = models.CharField(max_length=255, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Course(models.Model):
    userID = models.IntegerField(blank=False)
    courseCategory = models.IntegerField(blank=False)
    courseName = models.CharField(max_length=255, blank=True)
    courseSummary = models.TextField(blank=True)
    courseInformation = models.TextField(blank=True)
    courseImage = models.ImageField(upload_to="i", blank=True)
    courseThumbnail = ImageSpecField(source='courseImage', processors=[ResizeToFill(512, 512)],format='PNG')
    courseInstructorName = models.CharField(max_length=255, blank=True)
    courseInstructorInfo = models.TextField(blank=True)
    courseInstructorAvatar = models.ImageField(upload_to="i", blank=True)
    courseFeatured = models.BooleanField(blank=False)
    courseStatus = models.CharField(max_length=255, blank=False)
    coursePrice = models.IntegerField(blank=True)
    courseVideo = models.TextField(blank=True)
    archive = models.BooleanField(blank=False, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Lesson(models.Model):
    courseID = models.IntegerField(blank=False)
    lessonName = models.CharField(max_length=255, blank=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Lecture(models.Model):
    lessonID = models.IntegerField(blank=False)
    lectureName = models.CharField(max_length=255, blank=False)
    lectureContent = models.TextField(blank=True)
    lectureType = models.CharField(max_length=255, blank=False)
    lectureVideo = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Enroll(models.Model):
    userID = models.IntegerField(blank=False)
    courseID = models.IntegerField(blank=False)
    status = models.CharField(max_length=255, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Complete(models.Model):
    userID = models.IntegerField(blank=False)
    lectureID = models.IntegerField(blank=False)
    grade = models.DecimalField(blank=False, max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Question(models.Model):
    lectureID = models.IntegerField(blank=False)
    questionContent = models.TextField(blank=False)
    questionType = models.CharField(max_length=255, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Answer(models.Model):
    questionID = models.IntegerField(blank=False)
    answerContent = models.TextField(blank=False)
    isCorrect = models.BooleanField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Solution(models.Model):
    userID = models.IntegerField(blank=False)
    questionID = models.IntegerField(blank=False)
    answer = models.IntegerField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class File(models.Model):
    lectureID = models.IntegerField(blank=False)
    fileData = models.FileField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Category(models.Model):
    categoryName = models.CharField(max_length=255, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
