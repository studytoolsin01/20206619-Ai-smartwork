/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader(){
    const nav = document.getElementById('header')
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== BGM CONTROL ====================*/
const bgmBtn = document.getElementById('bgm-button')
const bgmAudio = document.getElementById('site-bgm')
let isPlaying = false

if(bgmBtn && bgmAudio) {
    bgmBtn.onclick = () => {
        if(isPlaying) {
            bgmAudio.pause()
            bgmBtn.classList.replace('ri-music-fill', 'ri-music-2-line')
        } else {
            bgmAudio.play().catch(e => console.log("BGM Play Error: ", e))
            bgmBtn.classList.replace('ri-music-2-line', 'ri-music-fill')
        }
        isPlaying = !isPlaying
    }
}

/*==================== CHATBOT ====================*/
const chatbotToggle = document.getElementById('chatbot-toggle')
const chatbotContainer = document.getElementById('chatbot-container')
const chatClose = document.getElementById('chat-close')
const sendBtn = document.getElementById('send-btn')
const chatInput = document.getElementById('chat-input-field')
const chatBody = document.getElementById('chat-body')

if(chatbotToggle) {
    chatbotToggle.onclick = () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
    };
}

if(chatClose) {
    chatClose.onclick = () => {
        chatbotContainer.style.display = 'none';
    };
}

function sendChatMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;

    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.innerText = text;
    chatBody.appendChild(userMsg);

    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    getBotResponse(text);
}

function getBotResponse(text) {
    const botMsg = document.createElement('div');
    botMsg.className = 'bot-message';

    if (text.includes("안녕") || text.includes("하이") || text.includes("반가워")) {
        botMsg.innerText = "안녕하세요! (주) 비에이텍입니다. 무엇을 도와드릴까요?";
    } else if (text.includes("펌프") || text.includes("제품") || text.includes("장비")) {
        botMsg.innerText = "저희 비에이텍은 다단볼루트펌프, 편흡입볼루트펌프, 원심펌프 등 산업용 핵심 펌프를 전문 제조합니다. 상세 사양은 '장비소개' 메뉴를 확인해 주세요.";
    } else if (text.includes("견적") || text.includes("가격") || text.includes("주문")) {
        botMsg.innerText = "제품 견적 및 주문 문의는 033-264-9243으로 전화 주시거나, '고객문의' 메뉴를 통해 메시지를 남겨주시면 신속히 답변 드리겠습니다.";
    } else if (text.includes("AS") || text.includes("수리") || text.includes("유지보수") || text.includes("관리")) {
        botMsg.innerText = "비에이텍은 철저한 사후관리를 보장합니다. 수리 및 점검이 필요하시면 고객센터(033-264-9243)로 연락 부탁드립니다.";
    } else if (text.includes("위치") || text.includes("어디") || text.includes("주소") || text.includes("공장")) {
        botMsg.innerText = "본사 및 공장은 [강원 춘천시 퇴계공단2길 64]에 위치하고 있습니다. '오시는 길' 메뉴에서 지도를 확인하실 수 있습니다.";
    } else if (text.includes("기술") || text.includes("특징") || text.includes("인증")) {
        botMsg.innerText = "비에이텍은 20년 이상의 노하우와 ISO9001, KC인증, MAIN-BIZ 인증 등을 보유한 검증된 기술력을 자랑합니다.";
    } else if (text.includes("연락처") || text.includes("전화") || text.includes("메일")) {
        botMsg.innerText = "대표전화: 033-264-9243 / 이메일: info@batech.co.kr 입니다. 상담 시간은 평일 오전 9시부터 오후 6시까지입니다.";
    } else {
        botMsg.innerText = "죄송합니다. 질문하신 내용을 정확히 이해하지 못했습니다. 자세한 문의는 고객센터(033-264-9243)로 연락 주시면 상세히 안내해 드리겠습니다.";
    }

    setTimeout(() => {
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);
}

if(sendBtn) sendBtn.onclick = sendChatMessage;
if(chatInput) {
    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') sendChatMessage();
    };
}

/*==================== AD MODAL ====================*/
function closeAdModal() {
    document.getElementById('ad-modal').style.display = 'none';
}

window.onload = () => {
    const dontShow = localStorage.getItem('dontShowAdToday');
    const today = new Date().toDateString();
    
    if (dontShow !== today) {
        setTimeout(() => {
            const adModal = document.getElementById('ad-modal');
            if(adModal) adModal.style.display = 'flex';
        }, 1500);
    }
};

document.getElementById('ad-dont-show-today')?.addEventListener('change', (e) => {
    if(e.target.checked) {
        localStorage.setItem('dontShowAdToday', new Date().toDateString());
    }
});

/*==================== LIGHTBOX ====================*/
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if(lightbox && lightboxImg) {
        lightbox.style.display = 'flex';
        lightboxImg.src = src;
    }
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

/*==================== PDF MODAL ====================*/
function openPDF(src) {
    const modal = document.getElementById('pdf-modal');
    const iframe = document.getElementById('pdf-iframe');
    if(modal && iframe) {
        modal.style.display = 'flex';
        iframe.src = src;
    }
}

function closePDF() {
    document.getElementById('pdf-modal').style.display = 'none';
}

/*==================== BROCHURE FLIPBOOK ====================*/
let pageFlip = null;

function openBrochure() {
    const modal = document.getElementById('brochure-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    // Initialize PageFlip ONLY if it hasn't been initialized yet
    if (!pageFlip) {
        const flipbookEl = document.getElementById("brochure-flipbook");
        if (flipbookEl) {
            try {
                // Dynamically calculate the optimal size based on screen size
                // Try to use about 75% of viewport height to leave room for UI, maintaining approx A4 aspect ratio
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                
                let bookHeight = Math.min(800, windowHeight * 0.75); 
                let bookWidth = bookHeight / 1.414; // Standard A4 aspect ratio

                // For double page spread, width is 2 * bookWidth.
                // If the spread exceeds 90% of screen width, scale down based on width instead
                if (bookWidth * 2 > windowWidth * 0.9) {
                    bookWidth = (windowWidth * 0.9) / 2;
                    bookHeight = bookWidth * 1.414;
                }

                // Enforce reasonable minimum size
                if (bookWidth < 280) {
                    bookWidth = 280;
                    bookHeight = 396;
                }

                // Round variables to integers for the library
                bookWidth = Math.round(bookWidth);
                bookHeight = Math.round(bookHeight);

                pageFlip = new St.PageFlip(flipbookEl, {
                    width: bookWidth,
                    height: bookHeight,
                    size: "fixed", // Use "fixed" to strictly enforce our dynamically computed maximum dimensions without squishing
                    minWidth: 200,
                    maxWidth: 800,
                    minHeight: 300,
                    maxHeight: 1130,
                    drawShadow: true,
                    showCover: true,
                    usePortrait: true,
                    mobileScrollSupport: false // To avoid conflict with flip gestures on touch
                });

                const pageElements = flipbookEl.querySelectorAll('.page');
                pageFlip.loadFromHTML(pageElements);

                const pageInfo = document.getElementById('brochure-page-info');
                
                // Update initial state
                if(pageInfo) {
                     pageInfo.innerText = `1 / ${pageElements.length}`;
                }

                // Handle page flip event to update counter
                pageFlip.on('flip', (e) => {
                    if (pageInfo) {
                        const currentPage = e.data + 1;
                        const totalPages = pageFlip.getPageCount();
                        pageInfo.innerText = `${currentPage} / ${totalPages}`;
                    }
                });

                // Prev/Next Handlers
                const prevBtn = document.getElementById('brochure-prev');
                const nextBtn = document.getElementById('brochure-next');

                if (prevBtn) {
                    prevBtn.onclick = () => {
                        pageFlip.flipPrev();
                    };
                }
                if (nextBtn) {
                    nextBtn.onclick = () => {
                        pageFlip.flipNext();
                    };
                }
            } catch (error) {
                console.error("Error initializing St.PageFlip: ", error);
            }
        }
    }
}

function closeBrochure() {
    const modal = document.getElementById('brochure-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/*==================== CARD NEWS SLIDER ====================*/
const track = document.getElementById('card-news-track');
const prevBtn = document.getElementById('card-prev');
const nextBtn = document.getElementById('card-next');
const dotsContainer = document.getElementById('slider-dots');

if (track) {
    const items = Array.from(track.children);
    let currentIndex = 0;
    let autoPlayInterval;

    // 1. Generate dots dynamically
    if (dotsContainer) {
        items.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    // 2. Functions to update slide
    function updateSlider() {
        // Apply transform based on current index
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active dot class
        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateSlider();
    }

    // 3. Bind Button Events
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // 4. Auto Play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000); // Slide every 4 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Initialize Auto Play
    startAutoPlay();

    // Pause autoplay on mouse over for better reading experience
    const sliderWrapper = track.parentElement;
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
        sliderWrapper.addEventListener('mouseleave', startAutoPlay);
    }
}

/*==================== INQUIRY STORAGE & FORM HANDLER ====================*/
// Sample Inquiries Init
const defaultInquiries = [
    {
        id: "inq_1717203600000",
        type: "견적문의",
        name: "(주)대하엔지니어링 / 김민준",
        phone: "010-9876-5432",
        email: "mj.kim@daehaeng.co.kr",
        message: "하수처리장용 편흡입 볼루트 펌프 5대 견적 및 사양서 송부 부탁드립니다. 설치 조건은 강원도 춘천 인근 농공단지 시설입니다. 유량 및 양정 상세 사양은 메일로 추가로 전달드리겠습니다.",
        date: "2026-05-30 11:24",
        status: "대기중",
        reply: ""
    },
    {
        id: "inq_1717290000000",
        type: "AS접수",
        name: "삼척시 상하수도사업소 / 박동현 과장",
        phone: "033-570-1234",
        email: "dhpark@samcheok.go.kr",
        message: "작년에 납품받은 부스터펌프 시스템 중 2호기 오작동으로 가동이 간헐적으로 중단되고 있습니다. 제어반 계기판에 E02 에러코드가 점멸되는데, 매뉴얼을 찾아보아도 해결 방안이 불확실하여 현장 점검 및 조치 방안 긴급 문의드립니다.",
        date: "2026-05-31 15:40",
        status: "대기중",
        reply: ""
    },
    {
        id: "inq_1717311600000",
        type: "카탈로그요청",
        name: "한빛설비 / 이서연 팀장",
        phone: "010-4321-8765",
        email: "sy.lee@hanbit.com",
        message: "신축 주상복합 건물 지하 배수시설에 들어갈 수중펌프 및 슬러지펌프 라인업 전체 카탈로그와 상세 도면 자료(CAD 파일)가 필요합니다. 견적 검토용이오니 이메일로 빠르게 받아볼 수 있으면 감사하겠습니다.",
        date: "2026-06-01 09:15",
        status: "처리완료",
        reply: "이서연 팀장님, 안녕하십니까. (주)비에이텍 기술지원부입니다. 요청하신 수중펌프 및 슬러지펌프 라인업이 수록된 종합 카탈로그와 정밀 CAD 도면 자료를 기재해주신 메일 주소(sy.lee@hanbit.com)로 발송해 드렸습니다. 당사 제품은 직접생산확인증명을 득한 조달 강점 제품이며 차후 A/S 등 신속한 사후관리를 보장합니다. 자료 검토 중 의문사항이나 상세 사양 변경 등이 필요하시면 언제든지 대표전화(033-264-9243)로 연락 부탁드립니다. 감사합니다."
    }
];

if (!localStorage.getItem('batech_inquiries')) {
    localStorage.setItem('batech_inquiries', JSON.stringify(defaultInquiries));
}

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('inquiry_type').value;
        const name = document.getElementById('user_name').value;
        const phone = document.getElementById('user_phone').value;
        const email = document.getElementById('user_email').value;
        const message = document.getElementById('user_message').value;
        const agree = document.getElementById('privacy_agree').checked;

        if (!agree) {
            if (contactStatus) {
                contactStatus.textContent = '개인정보 수집 및 이용에 동의해야 합니다.';
                contactStatus.style.color = '#e74c3c';
            }
            return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const dateStr = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${dateStr} ${hours}:${minutes}`;

        const newInquiry = {
            id: 'inq_' + now.getTime(),
            type: type,
            name: name,
            phone: phone,
            email: email,
            message: message,
            date: formattedDate,
            status: "대기중",
            reply: ""
        };

        let currentInquiries = [];
        try {
            currentInquiries = JSON.parse(localStorage.getItem('batech_inquiries')) || [];
        } catch (err) {
            currentInquiries = [];
        }

        currentInquiries.push(newInquiry);
        localStorage.setItem('batech_inquiries', JSON.stringify(currentInquiries));

        if (contactStatus) {
            contactStatus.textContent = '문의가 성공적으로 접수되었습니다. 최대한 빠른 시일 내에 답변드리겠습니다.';
            contactStatus.style.color = '#2ecc71';
            contactStatus.style.fontWeight = 'bold';
            contactStatus.style.marginTop = '1rem';
        }

        contactForm.reset();

        setTimeout(() => {
            if (contactStatus) contactStatus.textContent = '';
        }, 5000);
    });
}


