import { Badge, Button, Card, CardActionArea, makeStyles } from "@material-ui/core";
import {
  ArrowDownward,
  ArrowUpward,
  Cached,
  Check,
  CheckCircle,
  DoneOutline,
  Pause,
  PlayArrow,
} from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import "./App.css";

const useStyles = makeStyles({
  card: {
    maxWidth: "20em",
    margin: "Auto",
    backgroundColor: "#19ed6a",
  },
  card2: {
    fontWeight: "bold",
    width: "11em",
    margin: "Auto",
    backgroundColor: "#19ed6a",
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    margin: "1em"
  }
});

function App() {
  const classes = useStyles();
  const [displaytimer, setDisplayTimer] = useState(25*60);
  const [breaktime, setBreakTime] = useState(5*60);
  const [sessiontime, setSessionTime] = useState(25*60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(true);
  const [breakOver, setBreakOver] = useState(new Audio("./BreakOver.mp3"));
  const [sessionOver, setSessionOver] = useState(
    new Audio("./SessionOver.mp3")
    );
    const [sessionCount, setSessionCount] = useState(() => {
      const temp = JSON.parse(localStorage.getItem("sessionCount"));
      return temp || 0;
    })

  const Sessionsound = () => {
    sessionOver.currentTime = 0;
    sessionOver.play();
  };
  const Breaksound = () => {
    breakOver.currentTime = 0;
    breakOver.volume = 0.1;
    breakOver.play();
  };
  useEffect(() => {
    localStorage.setItem("sessionCount", JSON.stringify(sessionCount));
    if (displaytimer === 0 && onBreak) {
      Sessionsound();
      setDisplayTimer(breaktime);
      setOnBreak(!onBreak);
      console.log(`count: ${sessionCount}`)
      setSessionCount(sessionCount + 1)
    }
    if (displaytimer === 0 && !onBreak) {
      Breaksound();
      setDisplayTimer(sessiontime);
      setOnBreak(!onBreak);
    }
    // console.log(displaytimer);
  }, [displaytimer, onBreak]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breaktime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    }
    if (type === "session" && !timerOn) {
      if (sessiontime <= 60 && amount < 0) {
        return;
      }
      if (!timerOn) {
        setDisplayTimer(displaytimer + amount);
      }
      setSessionTime((prev) => prev + amount);
    }
  };
  // main code
  const controlTime = () => {
    let seconds = 1000;
    let date = new Date().getTime();
    let tempDate = date + seconds;
    if (!timerOn) {
      var interval = setInterval(() => {
        date = new Date().getTime();
        if (date > tempDate) {
          setDisplayTimer((prev) => {
            return prev - 1;
          });
          tempDate += seconds;
        }
      }, 1000);
      // setTimerOn(!timerOn);
      // localStorage.clear();
      localStorage.setItem("iterval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("iterval-id"));
    }
  };
  const resetTime = () => {
    setDisplayTimer(25*60);
    setBreakTime(5*60);
    setSessionTime(25*60);
  };

  return (
    <>
      <div className="heading">
        <h2>POMODORO TIMER</h2>
      </div>
      <main>
        <Card className={classes.card2}>
          <CardActionArea>
            <Length
              title={"Break Length"}
              changetime={changeTime}
              type={"break"}
              time={breaktime}
              formattime={formatTime}
            />
          </CardActionArea>
        </Card>
        <br />
        <Card className={classes.card2}>
          <CardActionArea>
            <Length
              title={"Session Length"}
              changetime={changeTime}
              type={"session"}
              time={sessiontime}
              formattime={formatTime}
            />
          </CardActionArea>
        </Card>
        <br />
        {sessionCount? <Badge badgeContent={sessionCount} color="secondary">
          <DoneOutline style={{ color: "#19ff6a" }} fontSize="medium" />
        </Badge> : <h2></h2>}
      </main>
      <Card className={classes.card}>
        <CardActionArea>
          <div className="timer">
            {timerOn ? (
              <h2>{onBreak ? "On Session" : "On Break"}</h2>
            ) : (
              <h2></h2>
            )}
            <h2>{formatTime(displaytimer)}</h2>
            {timerOn ? (
              <Pause
                fontSize="large"
                onClick={() => {
                  controlTime();
                  setTimerOn(!timerOn);
                }}
              />
            ) : (
              <PlayArrow
                fontSize="large"
                onClick={() => {
                  controlTime();
                  setTimerOn(!timerOn);
                }}
              />
            )}
            <Cached
              fontSize="large"
              onClick={() => {
                if (displaytimer === sessiontime) {
                  localStorage.clear();
                  setSessionCount(0);
                  return;
                }
                setSessionCount(0);
                resetTime();
                clearInterval(localStorage.getItem("iterval-id"));
                onBreak
                  ? setTimerOn(false)
                  : setOnBreak(!onBreak) && controlTime();
                setTimerOn(!timerOn);
                setOnBreak(true);
                timerOn ? setTimerOn(!timerOn) : setTimerOn(timerOn);
              }}
            />
          </div>
        </CardActionArea>
      </Card>
      <div>
        <Button
          className={classes.btn}
          variant="contained"
          color="secondary"
          onClick={() => {
            setDisplayTimer(7);
            setBreakTime(5);
            setSessionTime(7);
          }}
        >
          testing
        </Button>
      </div>
      <footer className="footer">
        <h4>Author : Vishal Singh</h4>
      </footer>
    </>
  );
}

// Length Component

function Length({ title, changetime, type, time, formattime }) {
  const classes = useStyles();
  return (
    <div>
      <h3>{title}</h3>
      <div className={classes.item}>
        <ArrowDownward
          onClick={() => {
            changetime(-60, type);
          }}
        />
        <h3>{formattime(time)}</h3>
        <ArrowUpward
          onClick={() => {
            changetime(60, type);
          }}
        />
      </div>
    </div>
  );
}

export default App;
