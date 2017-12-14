from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.paginator import Paginator
from .serializers import CourseSerializer, LessonSerializer, LectureSerializer, CategorySerializer, FileSerializer, QuestionSerializer, AnswerSerializer, CompleteSerializer, EnrollSerializer, ProfileSerializer, RoleSerializer, SolutionSerializer
from .models import Course, Lesson, Lecture, Category, File, Question, Answer, Complete, Enroll, Profile, Role, Solution
from django.contrib.auth.models import User
import stripe
from django.conf import settings

class GetCourseView(APIView):

    def get(self, request, category, count, page):

        if category == "0":
            courses = Course.objects.filter(archive=0, courseStatus='Published').values('id', 'courseName', 'courseCategory', 'courseSummary', 'courseImage')
        else:
            courses = Course.objects.filter(archive=0, courseCategory=category, courseStatus='Published').values('id', 'courseName', 'courseCategory', 'courseSummary', 'courseImage')

        coursesPage = Paginator(courses, count)
        courses = coursesPage.page(page)

        nextPage = courses.has_next()
        previousPage = courses.has_previous()

        if nextPage:
            nextPageNum = courses.next_page_number()
        else:
            nextPageNum = 0

        if previousPage:
            previousPageNum = courses.previous_page_number()
        else:
            previousPageNum = 0

        courses = list(courses)

        result = {"courses":courses, "nextPageNum": nextPageNum, "previousPageNum":previousPageNum}
        return Response(result)

class StoreCourseView(APIView):

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if not profile[0]['roleID'] == 3:
            return Response({"error":"You do not have permission."})

        userID = request.user.id
        courseCategory = 0
        courseName = request.POST.get('courseName')
        courseSummary = request.POST.get('courseSummary')
        courseInformation = request.POST.get('courseInformation')
        #courseImage = request.FILES['courseImage']
        courseInstructorName = request.POST.get('courseInstructorName')
        courseInstructorInfo = request.POST.get('courseInstructorInfo')
        courseInstructorAvatar = request.FILES.get('courseInstructorAvatar')
        courseFeatured = 0
        courseStatus = 'Draft'
        archive = 0

        course = Course(
            courseCategory = courseCategory,
            userID = userID,
            courseName = None,
            courseSummary =  None,
            courseInformation =  None,
            courseImage =  None,
            courseInstructorName =  None,
            courseInstructorInfo =  None,
            courseInstructorAvatar = None ,
            courseFeatured = courseFeatured,
            courseStatus = courseStatus,
            archive = archive
        )
        course.save()

        result = {"course": course.id}

        return Response(result)

    def put(self, request, id):

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        course = Course.objects.filter(id=id).values('userID')
        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if not course[0]['userID'] == request.user.id and not profile[0]['roleID'] == 1:
            return Response({"error":"You do not have permission."})

        if request.POST.get('courseCategory'):
            courseCategory = request.POST.get('courseCategory')
        else:
            courseCategory = 0

        if request.POST.get('courseName') != "" or request.POST.get('courseName') != "null":
            courseName = request.POST.get('courseName')
        else:
            courseName = None

        if request.POST.get('courseSummary') != "" or request.POST.get('courseSummary') != "null":
            courseSummary = request.POST.get('courseSummary')
        else:
            courseSummary = None

        if request.POST.get('courseInformation') != "" or request.POST.get('courseInformation') != "null":
            courseInformation = request.POST.get('courseInformation')
        else:
            courseInformation = None

        if request.POST.get('courseInstructorName') != "" or request.POST.get('courseInstructorName') != "null":
            courseInstructorName = request.POST.get('courseInstructorName')
        else:
            courseInstructorName = None

        if request.POST.get('courseInstructorInfo') != "" or request.POST.get('courseInstructorInfo') != "null":
            courseInstructorInfo = request.POST.get('courseInstructorInfo')
        else:
            courseInstructorInfo = None

        if request.POST.get('courseStatus') != "" or request.POST.get('courseStatus') != "null":
            courseStatus = request.POST.get('courseStatus')
        else:
            courseStatus = 'Draft'

        if request.POST.get('coursePrice') != "" or request.POST.get('coursePrice') != None:
            coursePrice = request.POST.get('coursePrice')
        else:
            coursePrice = None

        courseFeatured = 0
        archive = 0

        course = Course.objects.filter(id=id).update(
            courseCategory = courseCategory,
            courseName = courseName,
            courseSummary = courseSummary,
            courseInformation = courseInformation,
            courseInstructorName = courseInstructorName,
            courseInstructorInfo = courseInstructorInfo,
            courseFeatured = courseFeatured,
            courseStatus = courseStatus,
            coursePrice = coursePrice,
            archive = 0
        )

        result = {"success": "Course Updated"}

        return Response(result)

    def delete(self, request, id):

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        course = Course.objects.filter(id=id).values('userID')
        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if not profile[0]['roleID'] == 1:
            return Response({"error":"You do not have permission."})

        course = Course.objects.filter(id=id)
        course.delete()

        result = {'success':'Course Deleted'}
        return Response(result)

class RemoveCourseView(APIView):

    def put(self, request, id):
        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        course = Course.objects.filter(id=id).values('userID')
        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if course[0]['userID'] == request.user.id or profile[0]['roleID'] == 1:

            course = Course.objects.filter(id=id).update(archive=1)

            result = {"success":"Course Removed"}

        else:
            result = {"error":"You do not have permission."}

        return Response(result)

class UpdateCourseImageView(APIView):

    def put(self, request, id):

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        course = Course.objects.filter(id=id).values('userID')
        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if not course[0]['userID'] == request.user.id and not profile[0]['roleID'] == 1:
            return Response({"error":"You do not have permission."})

        if len(request.FILES['courseImage']) > 0:
            courseImage = request.FILES['courseImage']
            course = Course.objects.get(id=id)
            course.courseImage = courseImage
            course.save(update_fields=['courseImage'])

            result = {"success" : "Course Image Updated."}

        else:
            result = {"error" : "Nothing to Update."}

        return Response(result)

class UpdateCourseInstructorAvatarView(APIView):

    def put(self, request, id):

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        course = Course.objects.filter(id=id).values('userID')
        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if not course[0]['userID'] == request.user.id and not profile[0]['roleID'] == 1:
            return Response({"error":"You do not have permission."})

        if len(request.FILES['courseInstructorAvatar']) > 0:
            courseInstructorAvatar = request.FILES['courseInstructorAvatar']
            course = Course.objects.get(id=id)
            course.courseInstructorAvatar = courseInstructorAvatar
            course.save(update_fields=['courseInstructorAvatar'])

            result = {"success" : "Instructor Image Updated."}

        else:
            result = {"error" : "Nothing to Update."}

        return Response(result)


class ShowCourseView(APIView):

    def get(self, request, id):

        course = Course.objects.filter(id=id, courseStatus='Published', archive=0).values('id', 'userID', 'courseCategory', 'courseName', 'courseSummary', 'courseInformation',  'courseImage', 'courseInstructorName', 'courseInstructorInfo', 'courseInstructorAvatar', 'coursePrice', 'courseVideo')
        if course:
            lessons = Lesson.objects.filter(courseID=course[0]['id']).values('id', 'courseID', 'lessonName')
            lectures = []
            students = []
            files = []
            questions = []
            answers = []
            complete = 0
            percent = 0
            enrolled = 0

            if lessons:
                if not request.user.is_authenticated:
                    for lesson in lessons:
                        lecture = Lecture.objects.filter(lessonID=lesson['id']).values('id', 'lessonID', 'lectureName', 'lectureType')
                        if lecture:
                            for l in lecture:
                                lectures.append(l)

                else:
                    enroll = Enroll.objects.filter(userID=request.user.id, courseID=id).values('id')

                    if enroll or course[0]['userID'] == request.user.id:
                        enrolled = 1
                        for lesson in lessons:
                            lecture = Lecture.objects.filter(lessonID=lesson['id']).values('id', 'lessonID', 'lectureName', 'lectureType', 'lectureContent', 'lectureVideo')
                            if lecture:
                                for l in lecture:
                                    lecComplete = Complete.objects.filter(userID=request.user.id, lectureID=l['id']).values('id', 'grade')
                                    lecStatus = 0

                                    if lecComplete:
                                        lecStatus += 1
                                        l['complete'] = 1
                                        l['grade'] = lecComplete[0]['grade']
                                    else:
                                        l['complete'] = 0
                                        l['grade'] = 0

                                    l['status'] = lecStatus



                                    lectures.append(l)

                                    filesGet = File.objects.filter(lectureID=l['id']).values('id', 'lectureID', 'fileData')
                                    if filesGet:
                                        for lectureFile in filesGet:
                                            if lectureFile['lectureID'] == l['id']:
                                                files.append(lectureFile)

                                    questionsGet = Question.objects.filter(lectureID=l['id']).values('id', 'lectureID', 'questionContent', 'questionType')
                                    if questionsGet:
                                        for question in questionsGet:
                                            questions.append(question)

                                            answersGet = Answer.objects.filter(questionID=question['id']).values('id', 'questionID', 'answerContent')
                                            if answersGet:
                                                for answer in answersGet:
                                                    answers.append(answer)

                        enrolls = Enroll.objects.filter(courseID=id).values('id', 'userID', 'courseID', 'status')
                        for enroll in enrolls:
                            profile = Profile.objects.filter(userID=enroll['userID']).values('id', 'name', 'avatar_thumbnail')
                            complete = 0
                            for lesson in lessons:
                                lecture = Lecture.objects.filter(lessonID=lesson['id']).values('id', 'lessonID', 'lectureName', 'lectureType', 'lectureContent', 'lectureVideo')
                                if lecture:
                                    for l in lecture:
                                        completes = Complete.objects.filter(userID=enroll['userID'], lectureID=l['id']).values('id')
                                        complete += len(completes)

                            percent = complete/len(lectures) * 100
                            complete = str(complete) + '/' + str(len(lectures))
                            student = {"profile":profile[0], "status":enroll['status'], "complete":complete, "percent":percent}
                            students.append(student)

                    else:
                        for lesson in lessons:
                            lecture = Lecture.objects.filter(lessonID=lesson['id']).values('id', 'lessonID', 'lectureName', 'lectureType')
                            if lecture:
                                for l in lecture:
                                    lectures.append(l)

            result = {"course":course[0], "lessons":lessons, "lectures":lectures, "students":students, "questions":questions, "answers":answers, "files":files, "enrolled":enrolled}
        else:
            result = {"course":[], "lessons":[], "lectures":[] }

        return Response(result)

class EditCourseView(APIView):

    def get(self, request, id):
        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        course = Course.objects.filter(id=id).values('userID')
        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if not course[0]['userID'] == request.user.id and not profile[0]['roleID'] == 1:
            return Response({"error":"You do not have permission."})

        lectures = []
        files = []
        questions = []
        answers = []

        course = Course.objects.filter(archive=0, id=id).values('id', 'userID', 'courseCategory', 'courseName', 'courseSummary', 'courseInformation',  'courseImage', 'courseInstructorName', 'courseInstructorInfo', 'courseInstructorAvatar', 'coursePrice', 'courseStatus', 'courseVideo')
        lessons = Lesson.objects.filter(courseID=course[0]['id']).values('id', 'courseID', 'lessonName')
        if lessons:
            for lesson in lessons:
                lecturesGet = Lecture.objects.filter(lessonID=lesson['id']).values('id', 'lessonID', 'lectureName', 'lectureContent', 'lectureType', 'lectureVideo')
                if lecturesGet:
                    for lecture in lecturesGet:
                        lectures.append(lecture)

                        filesGet = File.objects.filter(lectureID=lecture['id']).values('id', 'lectureID', 'fileData')
                        if filesGet:
                            for lectureFile in filesGet:
                                files.append(lectureFile)

                        questionsGet = Question.objects.filter(lectureID=lecture['id']).values('id', 'lectureID', 'questionContent', 'questionType')
                        if questionsGet:
                            for question in questionsGet:
                                questions.append(question)

                                answersGet = Answer.objects.filter(questionID=question['id']).values('id', 'questionID', 'answerContent', 'isCorrect')
                                if answersGet:
                                    for answer in answersGet:
                                        answers.append(answer)

        result = {"course":course[0], "lessons":lessons, "lectures":lectures, "questions":questions, "answers":answers, "files":files}

        return Response(result)

class UpdateCorrectAnswerView(APIView):

    def put(self, request, lid, aid):
        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        course = Course.objects.filter(id=id).values('userID')
        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if not course[0]['userID'] == request.user.id and not profile[0]['roleID'] == 1:
            return Response({"error":"You do not have permission."})


        answer = Answer.objects.filter(lectureID=lid).update(isCorrect=False)
        answer = Answer.objects.filter(id=aid).update(isCorrect=False)

        result = {"success":"Answer Updated"}

        return Response(result)

class CompleteLectureView(APIView):

    def post(self, request):
        courseID = request.POST.get('courseID')
        lectureID = request.POST.get('lectureID')
        answers = request.POST.get('answers')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        enroll = Enroll.objects.filter(userID=request.user.id, courseID=courseID).values('id')

        if not enroll:
            result = {"error": "You are not enrolled in this course."}
        else:

            lecture = Lecture.objects.filter(id=lectureID).values('id', 'lectureType')
            completeCheck = Complete.objects.filter(lectureID=lecture[0]['id'], userID=request.user.id).values('id', "grade")
            if not completeCheck:

                if lecture[0]['lectureType'] == "Exam":
                    questionCount = 0
                    answerCount = 0

                    questions = Question.objects.filter(lectureID=lectureID).values('id')
                    questionCount = len(questions)

                    if not answers:
                        result = {"error":"Please answer all Questions."}
                        return Response(result)

                    for question in questions:
                        answerGet = Answer.objects.filter(questionID=question['id']).values('id', 'isCorrect')
                        for a in answerGet:
                            for answer in answers:
                                solution = Solution(
                                    userID = request.user.id,
                                    questionID = question['id'],
                                    answer = answer['answerID']
                                )
                                solution.save()

                                if a['id'] == answer['answerID'] and a['isCorrect'] == True:
                                    answerCount += 1

                    grade = answerCount/questionCount * 100
                    complete = Complete(userID = request.user.id, lectureID = lectureID, grade=grade)
                    complete.save()
                    result = {"success":"You have completed this Exam.", "grade":grade}
                else:
                    complete = Complete(userID = request.user.id, lectureID = lectureID, grade=100)
                    complete.save()
                    result = {"success":"You have completed this lecture."}

            else:
                result = {"success":"You've already completed this Exam.", "grade":completeCheck[0]['grade']}

        return Response(result)

class CompleteCourseView(APIView):

    def post(self, request):
        courseID = request.POST.get('courseID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        enroll = Enroll.objects.filter(userID=request.user.id, courseID=courseID).values('id')

        if not enroll:
            result = {"error": "You are not enrolled in this course."}
            return Response(result)

        lectureCount = 0
        completeCount = 0
        exams = []
        lessons = Lesson.objects.filter(courseID=courseID).values('id')
        for lesson in lessons:
            lectures = Lecture.objects.filter(lessonID=lesson['id']).value('id', 'lectureType')
            for lecture in lectures:
                lectureCount += 1
                if lecture['lectureType'] == "Exam":
                    exams.append(lecture)

                completes = Complete.objects.filter(userID=request.user.id, lectureID=lecture['id']).value('id')
                for complete in completes:
                    completeCount += 1


        totalGrade = 0
        for exam in exams:
            completes = Complete.objects.filter(userID=request.user.id, lectureID=exam['id']).value('id', 'grade')
            for complete in completes:
                totalGrade += complete['grade']

        averageGrade = totalGrade / len(exams)

        if lectureCount == completeCount and averageGrade >= 64.00:
            enrollUpdate = Enroll.objects.filter(userID=request.user.id, courseID=courseID).update(status="Graduate")

            result = {"success":"You have successfully completed this Course!"}

        else:

            result = {"error":"You have not successfully completed this Course."}

        return Response(result)





class EnrollCourseView(APIView):


    def post(self, request, id):

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        course = Course.objects.filter(id=id).values('id', 'coursePrice')
        if not course:
            return Response({"error":"This course does not exist."})

        profile = Profile.objects.filter(userID=request.user.id).values('id', 'roleID')
        if profile[0]['roleID'] == 3:
            return Response({"error":"You cannot enroll using an Instructor Account."})

        enroll = Enroll.objects.filter(userID=request.user.id, courseID=id).values('id')
        if not enroll:
            stripe.api_key = settings.STRIPE_TEST_SECRET_KEY
            token = request.POST.get('stripeToken')

            stripe_customer = stripe.Customer.create(
                card=token,
                description=request.user.email
            )

            stripe.Charge.create(
                amount=course[0]['coursePrice'], # in cents
                currency="usd",
                customer=stripe_customer.id
            )

            enroll = Enroll(userID = request.user.id, courseID = id, status = 'Ongoing')
            enroll.save()
            result = {"success": "You have been Enrolled to this class."}
        else:
            result = {"error": "You are already enrolled in this class."}

        return Response(result)

class StoreLessonView(APIView):

    def post(self, request):
        courseID = request.POST.get('courseID')
        lessonName = request.POST.get('lessonName')

        course = Course.objects.filter(id=courseID).values('userID')
        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        lesson = Lesson(courseID = courseID, lessonName = lessonName)
        lesson.save()

        result = {"success":lesson.id}
        return Response(result)

    def put(self, request, id):
        lesson = Lesson.objects.filter(id=id).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        lessonName = request.POST.get('lessonName')

        lesson = Lesson.objects.filter(id=id).update(lessonName = lessonName)

        result = {"success":lessonName}
        return Response(result)

    def delete(self, request, id):

        lesson = Lesson.objects.filter(id=id).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        lesson = Lesson.objects.filter(id=id)
        lesson.delete()

        result = {"success":"Lesson Deleted"}
        return Response(result)

class StoreLectureView(APIView):

    def post(self, request):

        lessonID = request.POST.get('lessonID')
        lectureName = request.POST.get('lectureName')
        lectureContent = request.POST.get('lectureContent')
        lectureType = request.POST.get('lectureType')

        lesson = Lesson.objects.filter(id=lessonID).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        lecture = Lecture(lessonID = lessonID,
            lectureName = lectureName,
            lectureContent = lectureContent,
            lectureType = lectureType
        )
        lecture.save()

        result = {"success":lecture.id}
        return Response(result)

    def put(self, request, id):
        lectureName = request.POST.get('lectureName')
        lectureContent = request.POST.get('lectureContent')
        lectureType = request.POST.get('lectureType')
        lectureVideo = request.POST.get('lectureVideo')

        lecture = Lecture.objects.filter(id=id).values('id', 'lectureName', 'lectureContent', 'lectureType', 'lessonID', 'lectureVideo')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        if not lectureName:
            lectureName = lecture[0]['lectureName']

        if not lectureContent:
            lectureContent = lecture[0]['lectureContent']

        if not lectureType:
            lectureType = lecture[0]['lectureType']

        if not lectureVideo:
            lectureVideo = lecture[0]['lectureVideo']

        lecture = Lecture.objects.filter(id = id).update(
            lectureName = lectureName,
            lectureContent = lectureContent,
            lectureType = lectureType,
            lectureVideo = lectureVideo
        )

        lecture = Lecture.objects.filter(id=id).values('id', 'lectureName', 'lectureContent', 'lectureType', 'lectureVideo')

        result = {"lecture":lecture[0]}
        return Response(result)

    def delete(self, request, id):

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        lecture = Lecture.objects.filter(id=id).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        lecture = Lecture.objects.filter(id = id)
        lecture.delete()

        result = {"success":"Lecture Deleted"}
        return Response(result)

class StoreFilesView(APIView):

    def post(self, request):
        lectureID = request.POST.get('lectureID')
        fileData = request.FILES['fileContent']

        lecture = Lecture.objects.filter(id=lectureID).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        files = File(lectureID = lectureID, fileData = fileData)
        files.save()

        result = {"success":files.id}

        return Response(result)

    def delete(self, request, id):

        files = File.objects.filter(id=id).values('lectureID')
        lecture = Lecture.objects.filter(id=files[0]['lectureID']).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        files = File.objects.filter(id=id)
        files.delete()

        result = {'success':'File Deleted'}
        return Response(result)

class StoreQuestionsView(APIView):

    def post(self, request):
        questionContent = request.POST.get('questionContent')
        questionType = request.POST.get('questionType')
        lectureID = request.POST.get('lectureID')

        lecture = Lecture.objects.filter(id=lectureID).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        question = Question(
            questionContent = questionContent,
            questionType = questionType,
            lectureID = lectureID
        )
        question.save()

        result = {'success': question.id}
        return Response(result)

    def put(self, request, id):
        questionContent = request.POST.get('questionContent')

        question = Question.objects.filter(id=id).values('lectureID')
        lecture = Lecture.objects.filter(id=question[0]['lectureID']).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        if not course[0]['userID'] == request.user.id:
            return Response({"error":"You do not have permission."})

        question = Question.objects.filter(id=id).update(
            questionContent = questionContent,
        )

        question = Question.objects.filter(id=id).values('id', 'questionContent')

        result = {'question':question[0]}
        return Response(result)

    def delete(self, request, id):

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        question = Question.objects.filter(id=id).values('lectureID')
        lecture = Lecture.objects.filter(id=question[0]['lectureID']).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not course[0]['userID'] == request.user.id:
            return Response({"error": "You do not have permission."})

        question = Question.objects.filter(id = id)
        question.delete()

        result = {'success':'Question Deleted'}
        return Response(result)

class StoreAnswerView(APIView):

    def post(self, request):
        questionID = request.POST.get('questionID')
        answerContent = request.POST.get('answerContent')
        isCorrect = request.POST.get('isCorrect')
        if isCorrect == "false":
            isCorrect = False

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        question = Question.objects.filter(id=questionID).values('lectureID')
        lecture = Lecture.objects.filter(id=question[0]['lectureID']).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not course[0]['userID'] == request.user.id:
            return Response({"error": "You do not have permission."})

        answer = Answer(
            questionID = questionID,
            answerContent = answerContent,
            isCorrect = isCorrect
        )
        answer.save()

        result = {"success":answer.id}
        return Response(result)

    def put(self, request, id):
        answerContent = request.POST.get('answerContent')

        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        answer = Answer.objects.filter(id=id).values('questionID')
        question = Question.objects.filter(id=answer[0]['questionID']).values('lectureID')
        lecture = Lecture.objects.filter(id=question[0]['lectureID']).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not course[0]['userID'] == request.user.id:
            return Response({"error": "You do not have permission."})

        answer = Answer.objects.filter(id=id).update(
            answerContent = answerContent,
        )

        answer = Answer.objects.filter(id=id).values('id', 'answerContent')

        result = {"answer":answer}

        return Response(result)

    def delete(self, request, id):
        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        answer = Answer.objects.filter(id=id).values('questionID')
        question = Question.objects.filter(id=answer[0]['questionID']).values('lectureID')
        lecture = Lecture.objects.filter(id=question[0]['lectureID']).values('lessonID')
        lesson = Lesson.objects.filter(id=lecture[0]['lessonID']).values('courseID')
        course = Course.objects.filter(id=lesson[0]['courseID']).values('userID')

        if not course[0]['userID'] == request.user.id:
            return Response({"error": "You do not have permission."})

        answer = Answer.objects.filter(id=id)
        answer.delete()

        result = {"success": "Answer Deleted"}

        return Response(result)

class GetCategoriesView(APIView):

    def get(self, request):
        categories = Category.objects.all().values('id', 'categoryName')

        result = {"categories":categories}
        return Response(result)

class MyCoursesView(APIView):

    def get(self, request, category, count, page):
        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        profile = Profile.objects.filter(userID=request.user.id).values('roleID')
        if profile[0]['roleID'] == 2:
            enrolls = Enroll.objects.filter(userID=request.user.id).values('id','courseID')
            enrollsPage = Paginator(enrolls, count)
            enrolls = enrollsPage.page(page)

            nextPage = enrolls.has_next()
            previousPage = enrolls.has_previous()

            if nextPage:
                nextPageNum = enrolls.next_page_number()
            else:
                nextPageNum = 0

            if previousPage:
                previousPageNum = enrolls.previous_page_number()
            else:
                previousPageNum = 0

            enrolls = list(enrolls)

            courses = []

            for e in enrolls:
                if category == "0":
                    course = Course.objects.filter(id=e['courseID']).values('id', 'courseName', 'userID', 'courseCategory', 'courseSummary', 'courseImage')
                else:
                    course = Course.objects.filter(id=e['courseID'], courseCategory=category).values('id', 'userID', 'courseName', 'courseCategory', 'courseSummary', 'courseImage')

                courses.append(course[0])

            for course in courses:
                complete = 0
                percent = 0
                lectureCount = 0

                lessons = Lesson.objects.filter(courseID=course['id']).values('id')
                for lesson in lessons:
                    lectures = Lecture.objects.filter(lessonID=lesson['id']).values('id')
                    for lecture in lectures:
                        lectureCount += len(lecture)
                        completes = Complete.objects.filter(userID=request.user.id, lectureID=lecture['id'])
                        if completes:
                            complete += len(completes)

                if lectureCount > 0:
                    course['percent']  = complete/lectureCount * 100
                    course['complete'] = str(complete) + '/' + str(lectureCount)

        elif profile[0]['roleID'] == 3:

            if category == "0":
                courses = Course.objects.filter(archive=0, userID=request.user.id).values('id', 'userID', 'courseName', 'courseCategory', 'courseSummary', 'courseImage', 'courseStatus')
            else:
                courses = Course.objects.filter(archive=0, courseCategory=category, courseStatus='Published').values('id', 'userID', 'courseName', 'courseCategory', 'courseSummary', 'courseImage', 'courseStatus')

            coursesPage = Paginator(courses, count)
            courses = coursesPage.page(page)

            nextPage = courses.has_next()
            previousPage = courses.has_previous()

            if nextPage:
                nextPageNum = courses.next_page_number()
            else:
                nextPageNum = 0

            if previousPage:
                previousPageNum = courses.previous_page_number()
            else:
                previousPageNum = 0

            courses = list(courses)

        result = {"courses": courses, "nextPageNum": nextPageNum, "previousPageNum":previousPageNum}
        return Response(result)

class SearchCourseView(APIView):

    def post(self, request, count, page):
        searchContent = request.POST.get('searchContent')

        courses = Course.objects.filter(archive=0, courseName__search=searchContent).values('id', 'courseName', 'courseCategory', 'courseSummary', 'courseImage') | Course.objects.filter(archive=0, courseSummary__search=searchContent).values('id', 'courseName', 'courseCategory', 'courseSummary', 'courseImage') | Course.objects.filter(archive=0, courseInformation__search=searchContent).values('id', 'courseName', 'courseCategory', 'courseSummary', 'courseImage')

        coursesPage = Paginator(courses, count)
        courses = coursesPage.page(page)

        nextPage = courses.has_next()
        previousPage = courses.has_previous()

        if nextPage:
            nextPageNum = courses.next_page_number()
        else:
            nextPageNum = 0

        if previousPage:
            previousPageNum = courses.previous_page_number()
        else:
            previousPageNum = 0

        courses = list(courses)

        result = {"courses": courses, "nextPageNum": nextPageNum, "previousPageNum":previousPageNum}
        return Response(result)


class StoreUserView(APIView):

    def post(self, request):
        name = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        sub = email[:2]
        avatar = 'https://invatar0.appspot.com/svg/'+sub+'.jpg'

        user = User.objects.create_user(
            password = password,
            is_superuser = 0,
            username = email,
            first_name = 'firstName',
            last_name = 'lastName',
            email = email,
            is_staff = 0,
            is_active = 1
        )
        user.save()

        profile = Profile(
            userID = user.id,
            name = name,
            roleID = 2,
            avatar_thumbnail = avatar
        )
        profile.save()

        result = {'success': 'Thanks for Signing Up!'}
        return Response(result)

class GetUserView(APIView):

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"error":"You are not logged in."})

        profile = Profile.objects.filter(userID=request.user.id).values('id', 'userID', 'avatar_thumbnail', 'name', 'roleID')

        result = {"user":profile[0]}
        return Response(result)
