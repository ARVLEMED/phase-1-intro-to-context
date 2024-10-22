const { types } = require("babel-core");

function createEmployeeRecord(employeeArray) {
    return {
        firstName: employeeArray[0],    
        familyName: employeeArray[1],     
        title: employeeArray[2],           
        payPerHour: employeeArray[3],      
        timeInEvents: [],                  
        timeOutEvents: []                  
    };
}

function createEmployeeRecords(employeeArrays) {
    return employeeArrays.map(createEmployeeRecord);
}

function validateTimestamp(timestamp) {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/; 
    if (!regex.test(timestamp)) {
        throw new Error(`Invalid timestamp format: ${timestamp}. Use YYYY-MM-DD HH:mm.`);
    }
}


function createTimeInEvent(employeeRecord, timeIn) {
    const [date, hour] = timeIn.split(" "); 
    const timeInEvent = {
        type: "TimeIn",                      
        hour: parseInt(hour, 10),            
        date: date                           
    };

    employeeRecord.timeInEvents.push(timeInEvent); 
    return employeeRecord;                        
}

function createTimeOutEvent(employeeRecord, timeOut) {
    const [date, hour] = timeOut.split(" "); 
    const timeOutEvent = {
        type: "TimeOut",                      
        hour: parseInt(hour, 10),              
        date: date                              
    };

    employeeRecord.timeOutEvents.push(timeOutEvent);
    return employeeRecord;                         
}

function hoursWorkedOnDate(employeeRecord, date) {
    const timeInEvent = employeeRecord.timeInEvents.find(event => event.date === date);
    const timeOutEvent = employeeRecord.timeOutEvents.find(event => event.date === date);

    
    if (!timeInEvent) {
        throw new Error(`No timeIn found for date: ${date}`);
    }
    if (!timeOutEvent) {
        throw new Error(`No timeOut found for date: ${date}`);
    }

    const hoursWorked = (timeOutEvent.hour - timeInEvent.hour) / 100; 
    return hoursWorked;
}

function wagesEarnedOnDate(employeeRecord, date) {
    const hoursWorked = hoursWorkedOnDate(employeeRecord, date);
    const payPerHour = employeeRecord.payPerHour;

    const wagesEarned = hoursWorked * payPerHour;
    return wagesEarned;
}

function allWagesFor(employeeRecord) {
    let totalWages = 0;

    for (const timeInEvent of employeeRecord.timeInEvents) {
        const date = timeInEvent.date; 
        totalWages += wagesEarnedOnDate(employeeRecord, date);
    }

    return totalWages; 
}

function calculatePayroll(employeeArray) {
    let totalPayroll = 0;

    for (const employeeRecord of employeeArray) {
        totalPayroll += allWagesFor(employeeRecord); 
    }

    return totalPayroll; 
}
