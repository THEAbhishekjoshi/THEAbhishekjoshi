// ----- REFERENCE FIREBASE SERVICES -----
const auth = firebase.auth();
const db = firebase.firestore();

// ----- QR CODE SETUP -----
let qrCode;
let userQRCodes = []; // Array to store user's QR codes

// Initialize QR Code
document.addEventListener("DOMContentLoaded", () => {
  qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "canvas",
    data: "",
    dotsOptions: { color: "#000000", type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { margin: 10 }
  });

  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
    localStorage.setItem('darkMode', this.checked);
  });

  if (localStorage.getItem('darkMode') === 'true') {
    darkModeToggle.checked = true;
    document.body.classList.add('dark-mode');
  }

  // Set up auth state listener
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      loadUserQRCodes();
    } else {
      // No user is signed in
      document.getElementById('login-screen').style.display = 'block';
      document.getElementById('app').style.display = 'none';
    }
  });

  // Set up button listeners
  document.getElementById('signUpBtn').addEventListener('click', signUp);
  document.getElementById('loginBtn').addEventListener('click', login);
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('generateBtn').addEventListener('click', updateQRCode);
});

// Auth functions
function signUp() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log("User created successfully");
    })
    .catch(error => {
      console.error("Signup error:", error);
      alert(error.message);
    });
}

function login() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("User logged in successfully");
    })
    .catch(error => {
      console.error("Login error:", error);
      alert(error.message);
    });
}

function logout() {
  auth.signOut().then(() => {
    console.log("User signed out successfully");
  }).catch(error => {
    console.error("Logout error:", error);
  });
}

// QR Code functions
function updateQRCode() {
  const text = document.getElementById('textInput').value;
  const color = document.getElementById('colorPicker').value;
  
  if (text) {
    qrCode.update({
      data: text,
      dotsOptions: { color: color }
    });
    qrCode.append(document.getElementById('qrCode'));
  }
}

function downloadQRCode() {
  const text = document.getElementById('textInput').value;
  if (text) {
    qrCode.download({
      name: "qr-code",
      extension: "png"
    });
    
    // Save to Firestore with additional data
    const user = auth.currentUser;
    if (user) {
      db.collection("qrCodes").add({
        uid: user.uid,
        userEmail: user.email, // Store user's email
        content: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        color: document.getElementById('colorPicker').value // Store color used
      }).then(() => {
        console.log("QR code saved to Firestore");
        loadUserQRCodes(); // Refresh the list
      }).catch(error => {
        console.error("Error saving QR code:", error);
      });
    }
  } else {
    alert("Please enter text or URL first");
  }
}

function loadUserQRCodes() {
  const user = auth.currentUser;
  if (!user) return;
  
  userQRCodes = []; // Reset array
  
  db.collection("qrCodes")
    .where("uid", "==", user.uid)
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      const qrData = [];
      snapshot.docs.forEach(doc => {
        qrData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      userQRCodes = qrData;
      renderQRList(qrData);
    })
    .catch(error => {
      console.error("Error loading QR codes:", error);
    });
}

function renderQRList(qrData) {
  const ul = document.getElementById("qrList");
  ul.innerHTML = "";
  
  if (qrData.length === 0) {
    ul.innerHTML = "<li>No QR codes generated yet</li>";
    return;
  }

  // Group by content and count occurrences
  const counts = {};
  const firstOccurrence = {}; // Store first occurrence for details
  
  qrData.forEach(item => {
    if (!counts[item.content]) {
      counts[item.content] = 0;
      firstOccurrence[item.content] = item;
    }
    counts[item.content]++;
  });

  // Display each unique QR with preview and details
  Object.entries(counts).forEach(([content, count]) => {
    const li = document.createElement("li");
    li.className = "qr-history-item";
    
    // Create a mini QR preview
    const previewDiv = document.createElement("div");
    previewDiv.className = "qr-preview";
    
    const previewQR = new QRCodeStyling({
      width: 60,
      height: 60,
      type: "canvas",
      data: content,
      dotsOptions: { 
        color: firstOccurrence[content].color || "#000000", 
        type: "rounded" 
      },
      backgroundOptions: { color: "#ffffff" }
    });
    
    const previewContainer = document.createElement("div");
    previewQR.append(previewContainer);
    previewDiv.appendChild(previewContainer);
    
    // Content and detailed info
    const infoDiv = document.createElement("div");
    infoDiv.className = "qr-info";
    
    const date = new Date(firstOccurrence[content].timestamp?.seconds * 1000 || Date.now());
    const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    infoDiv.innerHTML = `
      <div class="qr-content">${content}</div>
      <div class="qr-meta">
        <span>Generated: ${dateString}</span>
        <span>Used ${count} time${count > 1 ? 's' : ''}</span>
      </div>
      <div class="qr-actions">
        <button class="reuse-btn" data-content="${content}">Use Again</button>
      </div>
    `;
    
    li.appendChild(previewDiv);
    li.appendChild(infoDiv);
    ul.appendChild(li);
  });

  // Add event listeners to buttons
  document.querySelectorAll('.reuse-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const content = e.target.getAttribute('data-content');
      document.getElementById('textInput').value = content;
      updateQRCode();
    });
  });
}