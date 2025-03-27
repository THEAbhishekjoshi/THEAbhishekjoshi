var container = document.getElementById("array");

// Function to generate the array of blocks
function generatearray() {
    container.innerHTML = ""; // Clear previous blocks

    for (var i = 0; i < 20; i++) {
        // Return a value from 1 to 100 (both inclusive)
        var value = Math.ceil(Math.random() * 100);

        // Creating element div
        var array_ele = document.createElement("div");

        // Adding class 'block' to div
        array_ele.classList.add("block");

        // Adding style to div
        array_ele.style.height = `${value * 3}px`;
        array_ele.style.transform = `translate(${i * 30}px)`;

        // Creating label element for displaying size of particular block
        var array_ele_label = document.createElement("label");
        array_ele_label.classList.add("block_id");
        array_ele_label.innerText = value;

        // Appending created elements to index.html 
        array_ele.appendChild(array_ele_label);
        container.appendChild(array_ele);
    }

    // Reset progress bar on generating a new array
    resetProgress();
}

// Function to play sound
function playSound() {
    let sound = document.getElementById("swapSound");
    sound.currentTime = 0;
    sound.play();
}

// Function to swap elements
function swap(el1, el2) {
    return new Promise((resolve) => {
        // For exchanging styles of two blocks
        var temp = el1.style.transform;
        el1.style.transform = el2.style.transform;
        el2.style.transform = temp;

        window.requestAnimationFrame(function () {
            // For waiting for .25 sec
            setTimeout(() => {
                container.insertBefore(el2, el1);
                resolve();
            }, 300);
            playSound();
        });
    });
}

// Function to reset progress bar
function resetProgress() {
    let progressBar = document.getElementById("progress-bar");
    let progressText = document.getElementById("progress-text");

    progressBar.style.width = "0%";
    progressText.innerText = "0%";
}

// Function to update progress bar
function updateProgress(currentStep, totalSteps) {
    let progressBar = document.getElementById("progress-bar");
    let progressText = document.getElementById("progress-text");
    let progress = ((currentStep + 1) / totalSteps) * 100;

    progressBar.style.width = progress + "%";
    progressText.innerText = Math.round(progress) + "%";
}

// Asynchronous BubbleSort function
async function BubbleSort(delay = 100) {
    var blocks = document.querySelectorAll(".block");
    let totalSteps = blocks.length; // Total sorting passes

    // Reset progress at the start of sorting
    resetProgress();

    // BubbleSort Algorithm
    for (var i = 0; i < blocks.length; i += 1) {
        for (var j = 0; j < blocks.length - i - 1; j += 1) {
            // Change background color of the blocks to be compared
            blocks[j].style.backgroundColor = "#FF4949";
            blocks[j + 1].style.backgroundColor = "#FF4949";

            // Wait for .1 sec
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            console.log("run");
            var value1 = Number(blocks[j].childNodes[0].innerHTML);
            var value2 = Number(blocks[j + 1].childNodes[0].innerHTML);

            // Compare value of two blocks
            if (value1 > value2) {
                await swap(blocks[j], blocks[j + 1]);
                blocks = document.querySelectorAll(".block");
            }

            // Changing the color to the previous one
            blocks[j].style.backgroundColor = "#6b5b95";
            blocks[j + 1].style.backgroundColor = "#6b5b95";
        }

        // Changing the color of the greatest element found in the above traversal
        blocks[blocks.length - i - 1].style.backgroundColor = "#13CE66";

        // Update progress bar
        updateProgress(i, totalSteps);
    }
}

// Calling generatearray function
generatearray();

// Calling BubbleSort function
BubbleSort();
