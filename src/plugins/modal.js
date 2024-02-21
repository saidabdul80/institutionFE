// CustomModal.js

let modal = null;

export function showModal(options) {
  if(window.modalOpened){
    return false;
  }

  window.modalOpened = true
  if (modal) {
    closeModal();
  }
  const colorCodes = {
    success: '#3CCB7F',
    primary: '#1F56B3',
    warning: 'rgb(253, 176, 34)',
    error: '#F97066',
    white: '#FFFFFF',
    transparent:'transparent'
  };

 const { 
    closeOnClickOutside = true,
    confirmButton = true,    
    confirmBackground = 'warning',
    cancelBackground = 'warning',
    confirmOutline = 'transparent',
    cancelOutline = 'transparent',
  } = options;
  const confirmBackgroundColor = colorCodes[confirmBackground] || confirmBackground;
  const cancelBackgroundColor = colorCodes[cancelBackground] || cancelBackground;
  const confirmOutlineColor = colorCodes[confirmOutline] || confirmOutline;
  const cancelOutlineColor = colorCodes[cancelOutline] || cancelOutline;
  modal = document.createElement("div");
  modal.classList.add("custom-modal");
  modal.innerHTML = `
      <div class="cmodal" style="width: 100vw;height: 100vh;position: fixed;left: 0;top: 0;right: 0;bottom: 0;background-color: rgba(0, 0, 0, 0.5);display: flex;align-items: center;justify-content: center;    z-index: 11005;">
        <div class="modal-content d-flex align-items-center flex-column px-5 zoom-out-bounce" style="max-width:85%;max-heigh:80vh; position:reletive;">
        <span style="position: absolute;right: 15px;cursor:pointer;top: -1px;font-weight: 200;font-size: 1.7em;" id="cmodal-close" class='close'>&times</span>
        <div id="cmodal-ico"  class="pt-4 pb-2"></div>
        ${options?.title? "<h4 class='mb-1 text-center'><b>"+ options?.title + "</b></h4>":""}
        ${options?.text? "<p class='text-center w-100'>"+ options?.text + "</p>":""}        
        ${options?.selectOptions? "<select id='modal-select-option' class='form-control mb-2 w-75'><option value=''>-</option>"+ options.selectOptions?.map(item=> "<option value="+item+">"+item+"</option>" ) + "</select>":""}        
           <div id='modal-error-x' style='display:none' class="text-warning mb-2">Please select an option</div> 
          <div class=" mb-4 flex mt-2" style="justify-content:${options.cancelText?'space-between':'space-around'}">
          ${
            options.cancelText || false?
              `<button class="btn-cancel text-center py-2  ripple" style="border-radius: 10px;width:45%;background:${cancelBackgroundColor}; border:1px solid ${cancelOutlineColor}">${
                  options.cancelText || "Cancel"
             }</button>`
            :''
            }
            ${ 
              confirmButton?`<button class="btn-confirm text-center py-2 ripple" style="border-radius: 10px;width:45%;background:${confirmBackgroundColor}; border:1px solid ${confirmOutlineColor}">${
              options.confirmText || "Ok"
              }</button>`:''
            }          
            </div>
        </div>
      </div>
    `;
  if (options.text) {    
    document.body.appendChild(modal);
  }
  if(options?.icon){
    let bg = colorCodes[options?.icon] || confirmBackground;// options?.icon == 'success'?'#3CCB7F':options?.icon == 'primary'?"#1F56B3":options?.icon == 'warning'?' rgb(253, 176, 34)' : "#F97066";
    //let bglig = options?.icon == 'success'?'#3CCB7F77':options?.icon == 'primary'?"#B1CCFB":options?.icon == 'warning'?' rgba(253, 176, 34,.2)' : "#FECDCA";
    
    let icon = `<svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="56" height="56" rx="28" fill="${bg}"/>
    <rect x="5" y="5" width="56" height="56" rx="28" stroke="${bg}22" stroke-width="10"/>
     <animate attributeName="stroke-dasharray"  from="0 165" to="165 0" dur="0.5s" fill="freeze" />
      <animate attributeName="stroke-dashoffset"  from="165" to="0" dur="0.5s" fill="freeze" />
    </rect>  
    ${
      options?.icon == 'error'?
      `<g><line x1="23" x2="43" y1="23" y2="43" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2">         
      </line>
      <line x1="23" x2="43" y1="43" y2="23" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2">        
      </line></g>`:
     `<polyline points="23.9 30.6597 25.4102 32.0697 31 37.6597 43 25.6597 41.5902  " fill="none" stroke="#fff" stroke-width="2" >
          <animate attributeName="stroke-dasharray"  dur="1s"  from="0 65" to="65 0" fill="freeze" />
        <animate attributeName="stroke-dashoffset"   dur="1s" from="65" to="0" fill="freeze" />
      </polyline> `
    }
    </svg>
    `;
    setTimeout(()=>{
      document.getElementById('cmodal-ico').innerHTML = icon;
    },500)
  }
  return new Promise((resolve) => {
    confirmButton? modal.querySelector(".btn-confirm").addEventListener("click", () => {
      setTimeout(()=>{

      
      if(options.selectOptions){
        const selectedValue = document.querySelector("#modal-select-option").value;
        console.log(selectedValue)
        if (selectedValue) {
          closeModal();
          resolve(selectedValue);
        } else {
          const modalErrorX = document.querySelector("#modal-error-x");
          console.log(selectedValue, modalErrorX, 3892389)
          if (modalErrorX) {
            modalErrorX.style.display = "block";
          } else {
            console.error("Modal error element not found");
          }
        }
      }else{
        resolve(true); // Pass a value (true in this case) when the confirm button is clicked
      }
      },300)
    }):'';
    options.cancelText || false?
    modal.querySelector(".btn-cancel").addEventListener("click", () => {
      setTimeout(()=>{

        closeModal();
        resolve(false); // Pass a value (false in this case) when the cancel button is clicked
      },300)
    }) :''
    modal.querySelector("#cmodal-close").addEventListener("click", () => {      
      closeModal();
      resolve(false); // Pass a value (true in this case) when the confirm button is clicked
    });
    
    if (closeOnClickOutside) {
      modal.addEventListener("click", (e) => {
        if (e.target == modal || e.target === modal?.querySelector(".cmodal")) {
          closeModal();
          resolve(false); // Pass a value (false in this case) when the modal is closed by clicking outside
        }
      });
    }
  }).finally(() => {
    closeModal();
  });
}

function closeModal() {
  if (modal && modal.parentNode) {
    window.modalOpened = false
    modal.parentNode.removeChild(modal);
    modal = null;
  }
}

export function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "rgb(255 196 0 / 50%)";
  toast.style.color = "#3a2600";
  toast.style.padding = "10px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(140%)";
  toast.style.transition = "opacity 2s, transform 2s";

  
  // Create the success icon SVG
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.style.width = "20px";
  icon.style.height = "20px";
  icon.style.marginRight = "8px";
  icon.style.marginLeft = "8px";
  icon.style.marginBottom = "2px";

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "10");
  circle.style.fill = "#4CAF50";

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M9 16.17L5.53 12.7a.996.996 0 1 1 1.41-1.41L9 13.17l7.88-7.88a.996.996 0 1 1 1.41 1.41L9 16.17z"
  );
  path.style.fill = "#fff";

  icon.appendChild(circle);
  icon.appendChild(path);
  toast.appendChild(icon);
  
  document.body.appendChild(toast);
  // Animate the line once
  path.style.stroke = "#fff";
  path.style.strokeDasharray = "100";
  path.style.strokeDashoffset = "100";
  path.style.animation = "line-animation 2s ease-in-out forwards"; 

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(-100%)";
    setTimeout(() => {
      toast.style.transform = "translateY(-200%)";
      toast.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }, 10);
}

// Define the CSS animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes line-animation {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}`;
document.head.appendChild(style);