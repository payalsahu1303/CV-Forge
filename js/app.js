// regex for validation
const strRegex = /^[a-zA-Z\s]*$/; // containing only letters
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const validType = {
    TEXT: 'text',
    TEXT_EMP: 'text_emp',
    EMAIL: 'email',
    PHONENO: 'phoneno',
    ANY: 'any',
};

// User input elements
const mainForm = document.getElementById('cv-form');
const userInputs = {
    firstname: mainForm.firstname,
    middlename: mainForm.middlename,
    lastname: mainForm.lastname,
    image: mainForm.image,
    designation: mainForm.designation,
    address: mainForm.address,
    email: mainForm.email,
    phoneno: mainForm.phoneno,
    summary: mainForm.summary,
};

// Display elements
const displayElements = {
    name: document.getElementById('fullname_dsp'),
    image: document.getElementById('image_dsp'),
    phoneno: document.getElementById('phoneno_dsp'),
    email: document.getElementById('email_dsp'),
    address: document.getElementById('address_dsp'),
    designation: document.getElementById('designation_dsp'),
    summary: document.getElementById('summary_dsp'),
    projects: document.getElementById('projects_dsp'),
    achievements: document.getElementById('achievements_dsp'),
    skills: document.getElementById('skills_dsp'),
    educations: document.getElementById('educations_dsp'),
    experiences: document.getElementById('experiences_dsp'),
};

// Fetch Values Function
const fetchValues = (attrs, ...nodeLists) => {
    return Array.from({ length: nodeLists[0].length }, (_, i) => {
        return attrs.reduce((acc, attr, j) => {
            acc[attr] = nodeLists[j][i].value;
            return acc;
        }, {});
    });
};

// Get User Inputs Function
const getUserInputs = () => {
    const achievementsTitleElem = document.querySelectorAll('.achieve_title');
    const achievementsDescriptionElem = document.querySelectorAll('.achieve_description');
    const expElems = ['title', 'organization', 'location', 'start_date', 'end_date', 'description']
        .map(attr => document.querySelectorAll(`.exp_${attr}`));
    const eduElems = ['school', 'degree', 'city', 'start_date', 'graduation_date', 'description']
        .map(attr => document.querySelectorAll(`.edu_${attr}`));
    const projElems = ['title', 'link', 'description']
        .map(attr => document.querySelectorAll(`.proj_${attr}`));
    const skillElem = document.querySelectorAll('.skill');

    // Attach validation listeners
    const validations = {
        firstname: validType.TEXT,
        middlename: validType.TEXT_EMP,
        lastname: validType.TEXT,
        phoneno: validType.PHONENO,
        email: validType.EMAIL,
        address: validType.ANY,
        designation: validType.TEXT,
    };

    Object.entries(validations).forEach(([key, type]) => {
        userInputs[key].addEventListener('keyup', (e) => validateFormData(e.target, type, key));
    });

    const addValidationListener = (elems, type, name) => {
        elems.forEach(item => item.addEventListener('keyup', (e) => validateFormData(e.target, type, name)));
    };

    addValidationListener(achievementsTitleElem, validType.ANY, 'Achievement Title');
    addValidationListener(achievementsDescriptionElem, validType.ANY, 'Achievement Description');
    expElems.forEach((elems, index) => addValidationListener(elems, validType.ANY, ['Title', 'Organization', 'Location', 'Start Date', 'End Date', 'Description'][index]));
    eduElems.forEach((elems, index) => addValidationListener(elems, validType.ANY, ['School', 'Degree', 'City', 'Start Date', 'Graduation Date', 'Description'][index]));
    addValidationListener(projElems[0], validType.ANY, 'Project Title');
    addValidationListener(projElems[1], validType.ANY, 'Project Link');
    addValidationListener(projElems[2], validType.ANY, 'Project Description');
    addValidationListener(skillElem, validType.ANY, 'Skill');

    return {
        firstname: userInputs.firstname.value,
        middlename: userInputs.middlename.value,
        lastname: userInputs.lastname.value,
        designation: userInputs.designation.value,
        address: userInputs.address.value,
        email: userInputs.email.value,
        phoneno: userInputs.phoneno.value,
        summary: userInputs.summary.value,
        achievements: fetchValues(['achieve_title', 'achieve_description'], achievementsTitleElem, achievementsDescriptionElem),
        experiences: fetchValues(['exp_title', 'exp_organization', 'exp_location', 'exp_start_date', 'exp_end_date', 'exp_description'], ...expElems),
        educations: fetchValues(['edu_school', 'edu_degree', 'edu_city', 'edu_start_date', 'edu_graduation_date', 'edu_description'], ...eduElems),
        projects: fetchValues(['proj_title', 'proj_link', 'proj_description'], ...projElems),
        skills: fetchValues(['skill'], skillElem),
    };
};

// Validation Function
const validateFormData = (elem, type, name) => {
    const validators = {
        [validType.TEXT]: value => strRegex.test(value) && value.trim(),
        [validType.TEXT_EMP]: value => strRegex.test(value),
        [validType.EMAIL]: value => emailRegex.test(value) && value.trim(),
        [validType.PHONENO]: value => phoneRegex.test(value) && value.trim(),
        [validType.ANY]: value => value.trim(),
    };

    const isValid = validators[type](elem.value);
    isValid ? removeErrMsg(elem) : addErrMsg(elem, name);
};

const addErrMsg = (elem, name) => {
    elem.nextElementSibling.innerHTML = `${name} is invalid`;
};

const removeErrMsg = (elem) => {
    elem.nextElementSibling.innerHTML = "";
};

// Show List Data Function
const showListData = (listData, container) => {
    container.innerHTML = listData.map(item => 
        `<div class="preview-item">${Object.values(item).map(val => `<span class="preview-item-val">${val}</span>`).join('')}</div>`
    ).join('');
};

// Display CV Function
const displayCV = (userData) => {
    displayElements.name.innerHTML = `${userData.firstname} ${userData.middlename} ${userData.lastname}`;
    displayElements.phoneno.innerHTML = userData.phoneno;
    displayElements.email.innerHTML = userData.email;
    displayElements.address.innerHTML = userData.address;
    displayElements.designation.innerHTML = userData.designation;
    displayElements.summary.innerHTML = userData.summary;
    
    showListData(userData.projects, displayElements.projects);
    showListData(userData.achievements, displayElements.achievements);
    showListData(userData.skills, displayElements.skills);
    showListData(userData.educations, displayElements.educations);
    showListData(userData.experiences, displayElements.experiences);
};

// Generate CV Function
const generateCV = () => {
    const userData = getUserInputs();
    displayCV(userData);
    console.log(userData);
};

// Preview Image Function
const previewImage = () => {
    const oFReader = new FileReader();
    oFReader.readAsDataURL(userInputs.image.files[0]);
    oFReader.onload = (ofEvent) => {
        displayElements.image.src = ofEvent.target.result;
    };
};

// Print CV Function
const printCV = () => {
    window.print();
};

// Event Listeners for Image Preview
userInputs.image.addEventListener('change', previewImage);
