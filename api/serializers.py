from rest_framework import serializers
from .models import Course, Lesson, Lecture, Enroll, Complete, Question, Answer, File, Category, Profile, Role, Solution
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ('id', 'userID', 'name', 'avatar_thumbnail', 'roleID', 'stripe_id', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class RoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = ('id', 'roleName', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = ('id', 'userID', 'courseCategory', 'courseName', 'courseSummary', 'courseInformation', 'courseImage', 'courseThumbnail', 'courseInstructorName', 'courseInstructorInfo', 'courseInstructorAvatar', 'courseFeatured', 'courseStatus', 'coursePrice', 'courseVideo', 'archive', 'created_at', 'updated_at')
        read_only_fields = ('courseImage', 'courseThumbnail', 'created_at', 'updated_at')

class LessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = ('id', 'courseID', 'lessonName', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class LectureSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lecture
        fields = ('id', 'lessonID', 'lectureName', 'lectureContent', 'lectureType', 'lectureVideo', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class EnrollSerializer(serializers.ModelSerializer):

    class Meta:
        model = Enroll
        fields = ('userID', 'courseID', 'status', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class CompleteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complete
        fields = ('userID', 'lectureID', 'grade', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = ('lectureID', 'questionContent', 'questionType', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ('questionID', 'answerContent', 'isCorrect', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class SolutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Solution
        fields = ('userID', 'questionID', 'answer', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model = File
        fields = ('lectureID', 'filePath')
        read_only_fields = ('created_at', 'updated_at')

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ('categoryName', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
