import React, { useState, useRef, createRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Typography,
} from "@material-ui/core";
import Validator from "./Validator.jsx";
import "./GradeCalculator.css";

function GradeCalculator({ schoolYear }) {
  const [courses, setCourses] = useState([]);

  const [totalCredit, setTotalCredit] = useState();
  const [totalAttend, setTotalAttend] = useState();
  const [totalAssign, setTotalAssign] = useState();
  const [totalMidterm, setTotalMideterm] = useState();
  const [totalFinal, setTotalFinal] = useState();
  const [totalOfTotal, setTotalofTotal] = useState();
  const [average, setAverage] = useState();
  const [averageGrade, setAverageGrade] = useState();

  const [selectedRow, setSelectedRow] = useState();
  const [visible, setVisible] = useState(false);

  const courseRefs = useRef(
    courses.map(() => ({
      type: createRef(),
      essential: createRef(),
      name: createRef(),
      credit: createRef(),
      attendance: createRef(),
      assignment: createRef(),
      midterm: createRef(),
      finalExam: createRef(),
      totalScore: createRef(),
      grade: createRef(),
    }))
  );
  const onClickAddCourse = () => {
    setVisible(false);
    const newRef = {
      type: createRef(),
      essential: createRef(),
      name: createRef(),
      credit: createRef(),
      attendance: createRef(),
      assignment: createRef(),
      midterm: createRef(),
      finalExam: createRef(),
      totalScore: createRef(),
      grade: createRef(),
    };

    courseRefs.current = [...courseRefs.current, newRef];

    setCourses([
      ...courses,
      {
        type: "교양",
        essential: "선택",
        name: "",
        credit: 0,
        attendance: 0,
        assignment: 0,
        midterm: 0,
        finalExam: 0,
        totalScore: 0,
        grade: "",
      },
    ]);
  };

  const handleInputChange = (e, index) => {
    var { name, value } = e.target;
    if (value === "Pass" || value === "NonePass") {
      name = "grade";
    }
    const newCourses = [...courses];
    newCourses[index][name] = value;
    newCourses[index].totalScore = CalculateTotal(index);

    if (name !== "grade") {
      newCourses[index].grade = CalculateGrade(newCourses[index].totalScore);
    }

    setCourses(newCourses);
  }; //한 행에서 이뤄지는 값의 변화들을 다루는 함수

  function CalculateTotal(index) {
    var Total =
      Number(courses[index].assignment) +
      Number(courses[index].attendance) +
      Number(courses[index].midterm) +
      Number(courses[index].finalExam);
    return Total;
  } //한 행의 총점을 계산하는 함수

  function CalculateGrade(score) {
    if (score >= 95) {
      return "A+";
    } else if (score >= 90) {
      return "A0";
    } else if (score >= 85) {
      return "B+";
    } else if (score >= 80) {
      return "B0";
    } else if (score >= 75) {
      return "C+";
    } else if (score >= 70) {
      return "C0";
    } else if (score >= 65) {
      return "D+";
    } else if (score >= 60) {
      return "D0";
    } else {
      return "F";
    }
  } //A+ , A, B+ ... 계산하는 함수

  const OnClickRow = (index) => {
    setSelectedRow(index);
  };

  const handleDelete = (index) => {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
  };

  const OnClickSave = () => {
    const validationResult = Validator(courses);
    if (validationResult.error) {
      const errorIndex = validationResult.index;
      const errorField = validationResult.field;
      console.log(
        "Error field : " + errorField + ", Error index : " + errorIndex
      );
      courseRefs.current[errorIndex][errorField].current.focus();
      return;
    } else {
      setVisible(true);
      Validator(courses);
      sortCourses();
      var credit = 0;
      var attend = 0;
      var assign = 0;
      var midterm = 0;
      var final = 0;
      var total = 0;
      var cnt = 0;
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].grade === "Pass") {
          credit++;
          continue;
        }
        if (courses[i].grade === "NonePass") {
          credit++;
          continue;
        }
        cnt++;
        credit += Number(courses[i].credit);
        attend += Number(courses[i].attendance);
        assign += Number(courses[i].assignment);
        midterm += Number(courses[i].midterm);
        final += Number(courses[i].finalExam);
        total += Number(courses[i].totalScore);
      }
      setTotalCredit(credit);
      setTotalAttend(attend);
      setTotalAssign(assign);
      setTotalMideterm(midterm);
      setTotalFinal(final);
      setTotalofTotal(total);
      setAverage((Math.round((total / cnt) * 100) / 100).toFixed(2));
      setAverageGrade(CalculateGrade(total / cnt));
    }
  };

  const sortCourses = () => {
    const sortedArray = [...courses].sort((a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      if (a.essential < b.essential) return -1;
      if (a.essential > b.essential) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    setCourses(sortedArray);
  }; // 저장 버튼을 누를시 보여질 항목들

  return (
    <div style={{ margin: "50px 50px 0px 50px" }}>
      <div style={{ float: "left" }}>
        <Typography variant="h4" gutterBottom>
          {schoolYear}
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginLeft: "75%",
          marginRight: "4%",
        }}
      >
        <Button variant="contained" color="default" onClick={onClickAddCourse}>
          추가
        </Button>
        <Button
          variant="contained"
          color="default"
          onClick={() => handleDelete(selectedRow)}
        >
          삭제
        </Button>
        <Button variant="contained" color="default" onClick={OnClickSave}>
          저장
        </Button>
      </div>
      <div style={{ width: "90%", margin: "0% 5% 0% 5%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" className="styleHeader">
                이수
              </TableCell>
              <TableCell align="center" className="styleHeader">
                필수
              </TableCell>
              <TableCell align="center" className="styleHeader">
                과목명
              </TableCell>
              <TableCell align="center" className="styleHeader">
                학점
              </TableCell>
              <TableCell align="center" className="styleHeader">
                출석점수
              </TableCell>
              <TableCell align="center" className="styleHeader">
                과제점수
              </TableCell>
              <TableCell align="center" className="styleHeader">
                중간고사
              </TableCell>
              <TableCell align="center" className="styleHeader">
                기말고사
              </TableCell>
              <TableCell align="center" className="styleHeader">
                총점
              </TableCell>
              <TableCell align="center" className="styleHeader">
                평균
              </TableCell>
              <TableCell align="center" className="styleHeader">
                성적
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow
                onClick={() => OnClickRow(index)}
                key={index}
                style={
                  index === selectedRow
                    ? index % 2 === 0
                      ? {
                          backgroundColor: "#F6F8FA",
                          boxShadow: "4px 1px 1px 1px grey inset",
                        }
                      : {
                          backgroundColor: "#EBEDF0",
                          boxShadow: "4px 1px 1px 1px grey inset",
                        }
                    : index % 2 === 0
                    ? {
                        backgroundColor: "#F6F8FA",
                      }
                    : { backgroundColor: "#EBEDF0" }
                }
              >
                <TableCell align="center" className="style30">
                  <FormControl>
                    <InputLabel>이수</InputLabel>
                    <Select
                      name="type"
                      value={course.type}
                      onChange={(e) => handleInputChange(e, index)}
                    >
                      <MenuItem value="교양">교양</MenuItem>
                      <MenuItem value="전공">전공</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center" className="style30">
                  <FormControl>
                    <InputLabel>필수</InputLabel>
                    <Select
                      name="essential"
                      value={course.essential}
                      onChange={(e) => handleInputChange(e, index)}
                    >
                      <MenuItem value="필수">필수</MenuItem>
                      <MenuItem value="선택">선택</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="left" className="stylelong">
                  <TextField
                    inputRef={courseRefs.current[index].name}
                    inputProps={{ style: { textAlign: "left" } }}
                    name="name"
                    value={course.name}
                    error={
                      courses
                        .map((item) => item.name)
                        .filter((element) => course.name === element).length >
                        1 && course.name !== ""
                        ? true
                        : false
                    }
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </TableCell>
                <TableCell align="center" className="style30">
                  <TextField
                    inputRef={courseRefs.current[index].credit}
                    inputProps={{ style: { textAlign: "center" } }}
                    name="credit"
                    value={course.credit}
                    error={
                      course.credit < 0 ||
                      isNaN(course.credit)
                        ? true
                        : false
                    }
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  className={
                    course.credit === "1" ? { width: "width58" } : "style58"
                  }
                >
                  {course.credit === "1" ? (
                    <div></div>
                  ) : (
                    <TextField
                      inputRef={courseRefs.current[index].attendance}
                      inputProps={{ style: { textAlign: "center" } }}
                      name="attendance"
                      value={course.attendance}
                      error={
                        course.attendance < 0 ||
                        course.attendance > 20 ||
                        isNaN(course.attendance)
                          ? true
                          : false
                      }
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  )}
                </TableCell>
                <TableCell
                  className={
                    course.credit === "1" ? { width: "width58" } : "style58"
                  }
                >
                  {course.credit === "1" ? (
                    <div></div>
                  ) : (
                    <div>
                      <TextField
                        inputRef={courseRefs.current[index].assignment}
                        inputProps={{ style: { textAlign: "center" } }}
                        name="assignment"
                        value={course.assignment}
                        error={
                          course.assignment < 0 ||
                          course.assignment > 20 ||
                          isNaN(course.assignment)
                            ? true
                            : false
                        }
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell
                  align="center"
                  className={
                    course.credit === "1" ? { width: "width58" } : "style58"
                  }
                >
                  {course.credit === "1" ? (
                    <div></div>
                  ) : (
                    <div>
                      <TextField
                        inputRef={courseRefs.current[index].midterm}
                        inputProps={{ style: { textAlign: "center" } }}
                        name="midterm"
                        value={course.midterm}
                        error={
                          course.midterm < 0 ||
                          course.midterm > 30 ||
                          isNaN(course.midterm)
                            ? true
                            : false
                        }
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell
                  align="center"
                  className={
                    course.credit === "1" ? { width: "width58" } : "style58"
                  }
                >
                  {course.credit === "1" ? (
                    <div></div>
                  ) : (
                    <div>
                      <TextField
                        inputRef={courseRefs.current[index].finalExam}
                        inputProps={{ style: { textAlign: "center" } }}
                        name="finalExam"
                        value={course.finalExam}
                        error={
                          course.finalExam < 0 ||
                          course.finalExam > 30 ||
                          isNaN(course.finalExam)
                            ? true
                            : false
                        }
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell align="center" className="style30">
                  {course.credit === "1" ? (
                    <div></div>
                  ) : (
                    <div>{visible ? course.totalScore : ""}</div>
                  )}
                </TableCell>
                <TableCell align="center" style={{ width: "58px" }}></TableCell>
                <TableCell
                  align="center"
                  style={
                    course.grade === "F" ? { color: "red" } : { color: "black" }
                  }
                >
                  {course.credit === "1" ? (
                    visible ? (
                      course.grade
                    ) : (
                      <Select
                        onChange={(e) => {
                          handleInputChange(e, index);
                        }}
                      >
                        <MenuItem value="Pass">Pass</MenuItem>
                        <MenuItem value="NonePass">None Pass</MenuItem>
                      </Select>
                    )
                  ) : visible ? (
                    course.grade
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="center" colSpan={3}>
                합계
              </TableCell>
              <TableCell align="center">{visible ? totalCredit : ""}</TableCell>
              <TableCell align="center">{visible ? totalAttend : ""}</TableCell>
              <TableCell align="center">{visible ? totalAssign : ""}</TableCell>
              <TableCell align="center">
                {visible ? totalMidterm : ""}
              </TableCell>
              <TableCell align="center">{visible ? totalFinal : ""}</TableCell>
              <TableCell align="center">
                {visible ? totalOfTotal : ""}
              </TableCell>
              <TableCell align="center">{visible ? average : ""}</TableCell>
              <TableCell align="center">
                {visible ? averageGrade : ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default GradeCalculator;
