/*==================== AUTH STATE (MEMORY-BASED) ====================*/
window._batechLoggedIn = window._batechLoggedIn || false;

// Global state
let inquiries = [];
let currentFilter = 'all';
let activeSources = new Set(['src_report', 'src_volute', 'src_booster', 'src_dosing', 'src_submersible', 'src_mono', 'src_sludge', 'src_certs']);
let uploadedSources = [];

let chatHistory = [];

/*==================== GLOBAL LOGIN FUNCTION (called by onclick) ====================*/
function doLogin() {
    var pin = document.getElementById('lock-pin');
    var errorEl = document.getElementById('lock-error');
    var container = document.querySelector('.lock-container');

    if (!pin) return;

    if (pin.value.trim() !== '') {
        window._batechLoggedIn = true;
        var lockScreen = document.getElementById('lock-screen');
        var portalWrapper = document.getElementById('portal-wrapper');
        if (lockScreen)    lockScreen.style.display = 'none';
        if (portalWrapper) portalWrapper.style.display = 'block';
        if (errorEl)       errorEl.textContent = '';

        try { if (typeof loadInquiriesData    === 'function') loadInquiriesData(); }    catch(e){}
        try { if (typeof setupTabs            === 'function') setupTabs(); }            catch(e){}
        try { if (typeof setupInquiryControls === 'function') setupInquiryControls(); } catch(e){}
        try { if (typeof setupSources         === 'function') setupSources(); }         catch(e){}
        try { if (typeof setupChatConsole     === 'function') setupChatConsole(); }     catch(e){}
        try { if (typeof setupFileUpload      === 'function') setupFileUpload(); }      catch(e){}
    } else {
        if (errorEl) errorEl.textContent = '인증번호를 입력해 주십시오.';
        if (container) {
            container.classList.add('shake');
            setTimeout(function() { container.classList.remove('shake'); }, 500);
        }
        pin.value = '';
        pin.focus();
    }
}

function doLogout() {
    window._batechLoggedIn = false;
    window.location.reload();
}

// employee.js 전용 문의 초기 데이터 (script.js의 defaultInquiries와 이름 충돌 방지)
const empDefaultInquiries = [
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

// Detailed Company Knowledge Base for Mock AI (NotebookLM)
const KnowledgeBase = {
    src_report: {
        name: "비에이텍 기업 분석 보고서",
        content: `비에이텍(주) (Blue Advanced Technology Co., Ltd.)은 2010년 11월 1일 설립(개업일 2013년 2월 15일)된 강원특별자치도 춘천시 퇴계공단2길 64에 위치한 모터펌프 전문 제조/도매 기업입니다. 대표이사는 조세연이며, 임직원은 총 7명입니다. 공장 부지 면적은 1,970m²(제조시설 494m², 부대시설 280m²)로 자가 공장을 보유하고 있습니다.
2010년 ㈜강원유체로 시작하여 2013년 현재 상호인 비에이텍(주)으로 변경하였고, 한국펌프공업협동조합 조합원(제151호)입니다. 
주요 사업성과로는 2017년 12월 상수도 관리 활동 공로로 강원도지사 표창을 수상하였고, ISO 9001:2015 품질경영인증(유효기간 2027.08) 및 경영혁신형 중소기업(Main-Biz) 인증(유효기간 2027.09)을 득하였습니다.
납품 실적으로는 춘천시, 삼척시, 양구군, 양양군 등 강원도 내 주요 지자체 상하수도사업소 및 홍천군, 철원군 농업기술센터 등이 있습니다. 
SWOT 분석 요약:
- 강점(S): 강원도 공공기관 15년 밀착 네트워크, 11종 직접생산확인증명서 보유, 자가 공장 및 각종 인증 완비.
- 약점(W): 7명의 소규모 인력으로 다발성 대응 한계, 강원 외 지역 인지도 저조, IoT 연동 제품군 미보유.
- 기회(O): 강원특별자치도 인프라 예산 확대, 노후 상하수도 교체 수요 지속, 에너지 규제 강화로 고효율 펌프 수요.
- 위협(T): 타 지역 경쟁사의 가격 공세, 지자체 긴축 재정, 원자재비 상승.`
    },
    src_volute: {
        name: "다단볼루트펌프 매뉴얼",
        content: `다단볼루트펌프(Multi-stage Volute Pump) 유지관리지침서 주요 사항:
1. 개요: 고압 급수 및 배수용으로 설계된 다단식 원심 펌프입니다. 보일러 급수, 고지대 가압 송수, 공업용수 공급에 사용됩니다.
2. 가동 전 점검 순서:
   가. 베어링의 오일 레벨이 오일 게이지 중심선에 있는지 확인합니다.
   나. 축봉부(그랜드 패킹 또는 메카니컬 씰)의 누설 및 조임 상태를 점검합니다.
   다. 펌프 토출측 밸브는 완전히 닫고, 흡입측 밸브는 완전히 엽니다.
   라. 마중물(Priming Water)을 펌프 내부에 가득 채워 에어를 완전히 뺍니다. 에어 빼기 코크를 열어 물이 넘쳐 나올 때까지 채워야 합니다. 에어가 남아있는 채로 기동 시 임펠러 파손 및 펌프 소손의 원인이 됩니다.
   마. 펌프 커플링을 손으로 가볍게 돌려 회전이 원활한지 확인합니다.
3. 기동 후 운전 관리:
   - 운전 시작 직후 토출측 밸브를 서서히 열어 운전 압력을 확인합니다.
   - 모터 부하 전류를 측정하여 정격 전류 이하인지 확인합니다.
   - 그랜드 패킹 운전 시 분당 10~20방울 정도의 물이 지속적으로 똑똑 흘러내려 윤활 및 냉각이 되도록 패킹 글랜드를 조절해야 합니다. 완전히 물을 막으면 마찰열로 패킹이 타버립니다.`
    },
    src_booster: {
        name: "부스터펌프 매뉴얼",
        content: `부스터펌프 시스템(Booster Pump System) 유지관리 및 고장 대처 지침:
1. 개요: 개별 펌프 여러 대를 병렬 연결하여 인버터 제어로 건물 내 일정한 압력을 유지하는 시스템입니다.
2. 압력탱크 질소 충진 압력 설정:
   - 압력탱크의 초기 충진 가스(질소) 압력은 펌프 시동 압력(또는 설정 압력)의 약 80%~90% 수준으로 맞추어야 합니다.
   - 질소 압력이 너무 낮거나 충진되지 않은 경우, 배관 압력이 급격히 변하여 펌프가 비정상적으로 잦은 기동/정지(헌팅 현상)를 반복하여 인버터 모듈 및 모터 수명이 급감합니다.
3. 주요 에러 코드 및 점검 사항:
   - **E01 (과부하 / Overcurrent)**: 모터 내부 쇼트 또는 임펠러에 이물질이 끼어 과전류 발생. 모터 회전 축을 수동으로 회전시켜 고착 상태 확인 필요.
   - **E02 (저압 부족 / Low Pressure / Dry Run)**: 흡입관에 물이 공급되지 않아 공회전 상태 감지. 압력 센서 오작동 또는 흡입 밸브 차단 확인. 공회전 방지 장치(전극봉 또는 압력식) 복구 상태 점검 필수.
   - **E03 (센서 에러 / Sensor Fault)**: 4~20mA 압력 전송기 단선 또는 고장.`
    },
    src_dosing: {
        name: "정량펌프 매뉴얼",
        content: `정량주입펌프(Dosing / Chemical Pump) 안전 및 보수 지침:
1. 특징: 정밀한 화학 약품 투여용 막(디아프램) 왕복동식 펌프입니다. 정수장 및 하수처리장 응집제, 살균제 투입용으로 사용됩니다.
2. 약품 취급 안전:
   - 주입하는 화학 약품의 부식성을 고려하여 헤드 재질(PVC, PVDF, SUS316 등) 및 O-Ring 재질을 호환성에 맞게 설계해야 합니다.
   - 유지보수 전 펌프 내 압력을 완전히 배출시키고 약품 토출 배관을 세척액으로 순환 세척한 후 분해해야 합니다. 보호 장구(보호 안경, 고무 장갑) 필수 착용.
3. 유량 미달 고장 진단:
   - 체크밸브(볼 밸브)에 이물질이 고착되거나 마모된 경우 체크 능력을 상실해 역류가 발생하여 유량이 떨어집니다. 밸브 어셈블리를 해체해 테플론 볼과 시트를 청소하십시오.
   - 다이아프램 파손 시 뒷면 오일 챔버나 대기중으로 약품이 누설되므로 주기적 교체(약 5000시간 운전 기준)가 권장됩니다.`
    },
    src_submersible: {
        name: "수중펌프 매뉴얼",
        content: `수중모터펌프(Submersible Motor Pump) 안전 관리 지침:
1. 사용 환경: 모터와 펌프가 일체형으로 제작되어 수중에 완전히 잠긴 상태로 운전됩니다.
2. 가동 시 주의사항:
   - 펌프가 물 밖으로 노출된 상태에서 공기 중에서 모터를 기동하지 마십시오. 물에 잠겨 물로 냉각이 이루어지는 구조이므로, 공기 중 공회전 시 5분 이내에 모터 권선 코일이 과열되어 소손(태어짐)됩니다.
   - 수위 감지 장치(Float Switch 또는 레벨 센서)를 연동하여 갈수 시 자동 정지되도록 셋업되어야 합니다.
3. 절연 저항 점검:
   - 정기 점검 시 모터 케이블의 상간 절연 및 대지 간 절연 저항을 메가 테스터기(500V DC)로 측정해야 합니다.
   - 측정값이 10MΩ 이상이어야 안정적이며, 1MΩ 이하로 떨어지면 케이블 씰링 파손으로 누수가 발생한 것이므로 즉시 인양하여 씰(Mechanical Seal) 및 오일을 교체해야 합니다.`
    },
    src_mono: {
        name: "편흡입볼루트펌프 매뉴얼",
        content: `편흡입 볼루트 펌프(Single Suction Volute Pump) 설치 및 유지보수 지침:
1. 축 정렬(Alignment) 조절:
   - 공통 베드에 펌프와 모터를 결합할 때 커플링의 오차(외경 변위 및 평행 오차)를 편차가 0.05mm 이하가 되도록 다이얼 게이지를 사용하여 정밀 정렬해야 합니다.
   - 축 정렬 불량 시 진동과 소음이 과도하게 발생하며, 베어링 조기 파손 및 메카니컬 씰 누수가 일어납니다.
2. 기동 방향 점검:
   - 전원을 처음 투입할 때 반드시 모터 팬 방향을 보아 회전 방향이 펌프 하우징에 주조된 화살표 방향(일반적으로 회전축 쪽에서 시계 방향)과 일치하는지 순간 기동(Jogging)으로 확인합니다. 역회전 시 양정이 극도로 낮아지고 체절 운전으로 온도가 급상승합니다.`
    },
    src_sludge: {
        name: "슬러지펌프 매뉴얼",
        content: `슬러지 펌프(Sludge / Wastewater Pump) 막힘(Clogging) 해결 지침:
1. 개요: 섬유질, 찌꺼기, 토사가 섞인 슬러지를 이송하는 펌프로 주로 비폐쇄형(Non-Clog) 임펠러가 장착됩니다.
2. 막힘 현상 발생 시 대처법:
   - 과전류(E01) 트립이 발생하거나 소음과 함께 토출이 안 되는 경우 임펠러 막힘을 의심합니다.
   - 전원을 차단하고 시건 장치(Lock-out)를 조치한 후, 펌프 하부 청소용 핸드홀 커버를 열어 임펠러 날개 깃 사이에 끼어 있는 폐비닐, 섬유성 찌꺼기를 갈고리 등으로 완전히 청소하십시오.
3. 마모 방지: 슬러지에 모래 등 고형분이 많은 경우 임펠러와 마모판(Wear Plate) 간 극간이 넓어져 효율이 저하됩니다. 틈새가 1.5mm 이상 벌어지면 마모판을 조절하거나 교체하여 압력을 유지해야 합니다.`
    },
    src_certs: {
        name: "인증 및 면허 현황",
        content: `(주) 비에이텍 보유 인증서 상세 정보:
1. ISO 9001:2015 (품질경영시스템)
   - 인증 범위: 모터펌프의 설계, 개발, 제조 및 부가 서비스
   - 발급번호: QI291124 | 인증일: 2024.08.23 | 유효기간: 2027.08.22까지
   - 인증기관: ICR | [관리정보] 유효 만료 6개월 전 갱신 실사 사전 신청 필요.
2. 직접생산확인증명서 (조달청 나라장터 입찰 필수 자격)
   - 발급번호: 제2023-0616-00085호
   - 직접생산 정의 제품: 다단볼루트펌프, 수중펌프, 편흡입볼루트펌프, 양흡입펌프 등 총 11종 펌프 기기류 직접생산 증명.
   - 유효기간: 발급일 2025.06.10 ~ 2027.06.09 (2년간 유효)
3. 경영혁신형 중소기업 (Main-Biz)
   - 인증일: 2024.09.14 | 유효기간: 2027.09.13까지
   - 발급처: 중소벤처기업부 장관 (제R180801-01794호)`
    }
};

/*==================== INITIALIZATION ====================*/
document.addEventListener('DOMContentLoaded', function() {
    // 이미 로그인된 경우 포털 표시 (새로고침 후에도 변수가 살아있다면)
    if (window._batechLoggedIn === true) {
        var lockScreen = document.getElementById('lock-screen');
        var portalWrapper = document.getElementById('portal-wrapper');
        if (lockScreen) lockScreen.style.display = 'none';
        if (portalWrapper) portalWrapper.style.display = 'block';
        loadInquiriesData();
        setupTabs();
        setupInquiryControls();
        setupSources();
        setupChatConsole();
        setupFileUpload();
    }
    // 로그아웃 버튼 연결
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
});

/*==================== TAB SYSTEM ====================*/
function setupTabs() {
    const menuItems = document.querySelectorAll('.portal-nav-btn');
    const panes = document.querySelectorAll('.tab-pane');
    const portalTitle = document.getElementById('portal-title');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            
            // Remove active classes
            menuItems.forEach(i => i.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Set active
            item.classList.add('active');
            const targetPane = document.getElementById(`tab-${targetTab}`);
            if (targetPane) targetPane.classList.add('active');

            // Update title
            const label = item.querySelector('span').textContent;
            if (portalTitle) portalTitle.textContent = label;
        });
    });
}

/*==================== DATA MANIPULATION ====================*/
function loadInquiriesData() {
    const data = localStorage.getItem('batech_inquiries');
    if (data) {
        try {
            inquiries = JSON.parse(data);
        } catch (e) {
            inquiries = [];
        }
    } else {
        inquiries = empDefaultInquiries;
        localStorage.setItem('batech_inquiries', JSON.stringify(empDefaultInquiries));
    }

    // Sort by Date descending (most recent first)
    inquiries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update Dashboard Metrics & Table
    updateDashboardMetrics();
    renderInquiryTable();
}

function updateDashboardMetrics() {
    const totalCount = inquiries.length;
    const pendingCount = inquiries.filter(i => i.status === '대기중').length;
    const doneCount = inquiries.filter(i => i.status === '처리완료').length;

    // Set Dashboard Stats
    const totalEl = document.getElementById('stat-total-val');
    const pendingEl = document.getElementById('stat-pending-val');
    const doneEl = document.getElementById('stat-done-val');

    if (totalEl) totalEl.textContent = totalCount;
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (doneEl) doneEl.textContent = doneCount;

    // Render Quick Inquiry Panel
    const quickList = document.getElementById('quick-inquiry-list');
    if (quickList) {
        quickList.innerHTML = '';
        // Get last 3 inquiries
        const recent = inquiries.slice(0, 3);
        if (recent.length === 0) {
            quickList.innerHTML = '<div style="color: var(--text-light); text-align:center; padding: 1.5rem 0;">최근 접수된 문의가 없습니다.</div>';
            return;
        }

        recent.forEach(inq => {
            const item = document.createElement('div');
            item.className = 'quick-inquiry-item';
            
            const statusClass = inq.status === '대기중' ? 'pending' : 'done';
            
            item.innerHTML = `
                <div class="q-inq-details">
                    <div class="q-inq-title">${inq.name} <span style="font-size:0.75rem; color:var(--first-color);">[${inq.type}]</span></div>
                    <div class="q-inq-meta">
                        <span>${inq.date}</span>
                        <span>${inq.email}</span>
                    </div>
                </div>
                <span class="q-inq-status ${statusClass}">${inq.status}</span>
            `;
            
            // Clicking quick item switches to Inquiry tab and opens detail modal
            item.addEventListener('click', () => {
                // Trigger sidebar click
                const inqTabBtn = document.querySelector('.menu-item[data-tab="inquiries"]');
                if (inqTabBtn) inqTabBtn.click();
                openInquiryDetailModal(inq.id);
            });

            quickList.appendChild(item);
        });
    }
}

/*==================== INQUIRY BOX MANAGER ====================*/
function renderInquiryTable() {
    const tbody = document.getElementById('inquiry-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Filter inquiries
    let filtered = inquiries;
    if (currentFilter === 'pending') {
        filtered = inquiries.filter(i => i.status === '대기중');
    } else if (currentFilter === 'resolved') {
        filtered = inquiries.filter(i => i.status === '처리완료');
    }

    // Search filter
    const query = document.getElementById('inquiry-search-field')?.value.toLowerCase().trim();
    if (query) {
        filtered = filtered.filter(i => 
            i.name.toLowerCase().includes(query) ||
            i.email.toLowerCase().includes(query) ||
            i.phone.toLowerCase().includes(query) ||
            i.message.toLowerCase().includes(query) ||
            i.type.toLowerCase().includes(query)
        );
    }

    // Render count
    const infoCount = document.getElementById('table-info-count');
    if (infoCount) {
        infoCount.textContent = `검색 결과: ${filtered.length}건 / 전체: ${inquiries.length}건`;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-light); padding: 3rem 0;">
                    조건에 해당하는 문의 내역이 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(inq => {
        const tr = document.createElement('tr');
        const statusClass = inq.status === '대기중' ? 'pending' : 'done';
        const msgSnippet = inq.message.length > 35 ? inq.message.substring(0, 35) + '...' : inq.message;

        tr.innerHTML = `
            <td class="row-type">${inq.type}</td>
            <td class="row-name">${inq.name}</td>
            <td class="row-msg-preview" title="${inq.message.replace(/"/g, '&quot;')}">${msgSnippet}</td>
            <td>${inq.date}</td>
            <td>
                <span class="status-badge ${statusClass}" data-id="${inq.id}">
                    <i class="ri-checkbox-blank-circle-fill"></i> ${inq.status}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view-btn" title="상세보기" data-id="${inq.id}"><i class="ri-eye-line"></i></button>
                    <button class="action-btn del-btn" title="삭제" data-id="${inq.id}"><i class="ri-delete-bin-line"></i></button>
                </div>
            </td>
        `;

        // Bind Status click to toggle directly in table
        tr.querySelector('.status-badge').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleInquiryStatus(inq.id);
        });

        // Action view button
        tr.querySelector('.view-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openInquiryDetailModal(inq.id);
        });

        // Action delete button
        tr.querySelector('.del-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteInquiry(inq.id);
        });

        // Double click row opens details
        tr.addEventListener('dblclick', () => {
            openInquiryDetailModal(inq.id);
        });

        tbody.appendChild(tr);
    });
}

function setupInquiryControls() {
    // Search input
    const searchField = document.getElementById('inquiry-search-field');
    if (searchField) {
        searchField.addEventListener('input', renderInquiryTable);
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderInquiryTable();
        });
    });

    // Setup modal overlay close
    const inqModal = document.getElementById('inquiry-detail-modal');
    if (inqModal) {
        inqModal.addEventListener('click', (e) => {
            if (e.target === inqModal) {
                closeInquiryModal();
            }
        });
        
        inqModal.querySelector('.modal-close').addEventListener('click', closeInquiryModal);
        inqModal.querySelector('#modal-cancel-btn').addEventListener('click', closeInquiryModal);
        
        // Save reply button
        inqModal.querySelector('#modal-save-reply-btn').addEventListener('click', handleSaveReply);
    }
}

function toggleInquiryStatus(id) {
    const idx = inquiries.findIndex(i => i.id === id);
    if (idx !== -1) {
        inquiries[idx].status = inquiries[idx].status === '대기중' ? '처리완료' : '대기중';
        localStorage.setItem('batech_inquiries', JSON.stringify(inquiries));
        loadInquiriesData();
    }
}

function deleteInquiry(id) {
    if (confirm('해당 문의 내역을 정말 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.')) {
        inquiries = inquiries.filter(i => i.id !== id);
        localStorage.setItem('batech_inquiries', JSON.stringify(inquiries));
        loadInquiriesData();
    }
}

/*==================== MODAL DETAIL VIEW ====================*/
let activeModalInquiryId = null;

function openInquiryDetailModal(id) {
    const inq = inquiries.find(i => i.id === id);
    if (!inq) return;

    activeModalInquiryId = id;
    const modal = document.getElementById('inquiry-detail-modal');

    // Populate contents
    document.getElementById('modal-inq-type').textContent = inq.type;
    document.getElementById('modal-inq-name').textContent = inq.name;
    document.getElementById('modal-inq-phone').textContent = inq.phone;
    document.getElementById('modal-inq-email').textContent = inq.email;
    document.getElementById('modal-inq-date').textContent = inq.date;
    document.getElementById('modal-inq-status').textContent = inq.status;
    
    // Status text colors
    const statusEl = document.getElementById('modal-inq-status');
    if (inq.status === '대기중') {
        statusEl.className = 'detail-value';
        statusEl.style.color = 'var(--warning)';
    } else {
        statusEl.className = 'detail-value';
        statusEl.style.color = 'var(--success)';
    }

    document.getElementById('modal-inq-message').textContent = inq.message;
    
    // Populate textarea reply
    const replyTextarea = document.getElementById('modal-reply-text');
    replyTextarea.value = inq.reply || '';

    // Load templates buttons based on Inquiry Type
    const templateContainer = document.getElementById('reply-templates-box');
    if (templateContainer) {
        setupReplyTemplates(inq.type, inq.name);
    }

    // Open modal
    modal.classList.add('active');
}

function closeInquiryModal() {
    const modal = document.getElementById('inquiry-detail-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    activeModalInquiryId = null;
}

function setupReplyTemplates(type, name) {
    const container = document.getElementById('reply-templates-box');
    if (!container) return;

    container.innerHTML = '';
    
    // Generate templates based on type
    let templates = [];
    if (type === '견적문의') {
        templates = [
            {
                title: "견적 검토 안내",
                text: `${name} 담당자님, 안녕하십니까. (주)비에이텍 조세연입니다. 문의하신 제품 견적 사항을 당사 설계팀과 기술 검토 중에 있습니다. 기재해주신 연락처로 1~2일 내에 상세 견적서 및 관련 사양서를 작성하여 메일로 정식 발송해 드리도록 하겠습니다. 당사 제품은 품질이 인증된 직접생산 제품으로 철저한 A/S를 보장합니다. 추가 문의사항이 있으시면 언제든지 033-264-9243으로 연락 주십시오. 감사합니다.`
            },
            {
                title: "추가 정보 요청",
                text: `${name} 담당자님, 안녕하십니까. (주)비에이텍입니다. 제품 견적 작성을 위해 배관 도면 및 원하시는 상세 양정/유량 등의 기술 사양 조건 확인이 필요합니다. 기재해주신 이메일로 회신주시거나 대표번호(033-264-9243)로 연락주시면 기술 검토 후 정밀한 맞춤형 견적서를 보내드리겠습니다. 감사합니다.`
            }
        ];
    } else if (type === 'AS접수') {
        templates = [
            {
                title: "AS 방문 일정 협의",
                text: `${name} 담당자님, 안녕하십니까. (주)비에이텍 A/S 기술팀입니다. 신청해주신 장비 오작동 접수 완료되었습니다. 당사 춘천 유지보수 거점에서 서비스 담당 엔지니어가 배정되었으며, 현장 방문 및 원인 분석을 위해 연락드려 일정을 협의할 예정입니다. 불편을 끼쳐드려 대단히 죄송하며, 최대한 신속히 해결하도록 하겠습니다. 감사합니다.`
            },
            {
                title: "에러코드(E02) 조치 안내",
                text: `${name} 담당자님, 안녕하십니까. (주)비에이텍입니다. 접수해주신 부스터펌프 시스템의 E02 에러코드는 '공회전 방지 장치(Dry Run Protection)'가 작동한 것입니다. 흡입 측 밸브가 닫혀있거나 계통에 물 유입이 중단되었을 수 있으니 먼저 흡입 밸브 개폐 상태를 점검하시기 바랍니다. 이후 제어반에서 복귀(Reset) 버튼을 누르고 재기동해주십시오. 증상이 지속되는 경우 긴급 점검팀을 출동시키도록 하겠습니다. 감사합니다.`
            }
        ];
    } else {
        templates = [
            {
                title: "일반 문의 답변",
                text: `${name}님, 안녕하십니까. (주)비에이텍입니다. 남겨주신 문의 사항 확인하였으며, 이에 대해 담당 직원을 배정하여 유선 또는 메일로 신속히 답변을 드릴 수 있도록 조치하겠습니다. 당사 서비스에 관심 가져주셔서 대단히 감사합니다.`
            }
        ];
    }

    // Render template chips
    templates.forEach((tpl) => {
        const btn = document.createElement('button');
        btn.className = 'prompt-chip';
        btn.style.fontSize = '0.75rem';
        btn.style.margin = '0.25rem';
        btn.textContent = tpl.title;
        btn.addEventListener('click', () => {
            document.getElementById('modal-reply-text').value = tpl.text;
        });
        container.appendChild(btn);
    });
}

function handleSaveReply() {
    if (!activeModalInquiryId) return;

    const replyText = document.getElementById('modal-reply-text').value.trim();
    
    // Save to list
    const idx = inquiries.findIndex(i => i.id === activeModalInquiryId);
    if (idx !== -1) {
        inquiries[idx].reply = replyText;
        // Auto mark as resolved if reply is written
        if (replyText.length > 0) {
            inquiries[idx].status = '처리완료';
        }
        
        localStorage.setItem('batech_inquiries', JSON.stringify(inquiries));
        loadInquiriesData();

        // Feedback notification
        alert("답변 작성이 완료되었으며, 고객 메일(시뮬레이션)로 정상 송부되었습니다.");
        closeInquiryModal();
    }
}

// Sparkly Confetti Burst effect for modern UX wow
function triggerConfettiBurst() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

    for (let i = 0; i < 120; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height * 0.7,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.8) * 18 - 5,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rSpeed: Math.random() * 6 - 3,
            opacity: 1
        });
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let alive = false;
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.45; // gravity
            p.vx *= 0.98; // resistance
            p.rotation += p.rSpeed;
            p.opacity -= 0.015;

            if (p.opacity > 0) {
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (alive) {
            requestAnimationFrame(update);
        } else {
            canvas.remove();
        }
    }

    update();
}

/*==================== NOTEBOOKLM AI KNOWLEDGE CORE ====================*/
function setupSources() {
    const cards = document.querySelectorAll('.source-card');

    cards.forEach(card => {
        const id = card.getAttribute('data-src-id');

        if (activeSources.has(id)) {
            card.classList.add('checked');
        } else {
            card.classList.remove('checked');
        }

        card.addEventListener('click', () => {
            if (activeSources.has(id)) {
                if (activeSources.size > 1) {
                    activeSources.delete(id);
                    card.classList.remove('checked');
                } else {
                    alert("최소 하나의 소스 문서는 선택해야 합니다.");
                }
            } else {
                activeSources.add(id);
                card.classList.add('checked');
            }
            // 소스 변경 시 대화 히스토리 초기화
            chatHistory = [];
            updateActiveSourcesPill();
        });
    });

    updateActiveSourcesPill();
}

function updateActiveSourcesPill() {
    const pill = document.getElementById('active-sources-pill');
    if (pill) {
        const count = activeSources.size + uploadedSources.length;
        pill.textContent = `소스 ${count}개 선택됨`;
    }
}

function setupChatConsole() {
    const chatInput = document.getElementById('chat-console-input');
    const sendBtn = document.getElementById('chat-console-send-btn');
    const msgContainer = document.getElementById('chat-messages');

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', submitConsoleMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitConsoleMessage();
        });
    }

    // Setup Suggestion prompt chips
    const suggestions = document.querySelectorAll('.prompt-suggestions .prompt-chip');
    suggestions.forEach(chip => {
        chip.addEventListener('click', () => {
            if (chatInput) {
                chatInput.value = chip.textContent;
                chatInput.focus();
            }
        });
    });

    // Auto greetings inside chatbot
    if (msgContainer && msgContainer.children.length === 0) {
        addMessageBubble('ai', `안녕하세요, 비에이텍 임직원 지식 포털입니다. 
좌측에 활성화된 사내 지식소스 문서를 기반으로 실시간 질의응답이 가능합니다. 
궁금하신 펌프 정비 규격, 에러 코드 대처법 또는 경영 정보를 입력해 주십시오.`);
    }
}

function submitConsoleMessage() {
    const chatInput = document.getElementById('chat-console-input');
    if (!chatInput) return;

    const query = chatInput.value.trim();
    if (query === '') return;

    // Add user message
    addMessageBubble('user', query);
    chatInput.value = '';

    // Scroll to bottom
    const msgContainer = document.getElementById('chat-messages');
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // Generate AI reply with loading state
    generateAiResponse(query);
}

function addMessageBubble(sender, text, citations = []) {
    const container = document.getElementById('chat-messages');
    if (!container) return null;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;

    if (sender === 'ai') {
        const senderHeader = document.createElement('div');
        senderHeader.className = 'bubble-sender';
        senderHeader.innerHTML = '<i class="ri-cpu-line"></i> 비에이텍 AI 어시스턴트';
        bubble.appendChild(senderHeader);
        
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = formatMarkdownResponse(text);
        
        // Append citations if any
        if (citations.length > 0) {
            const citeBox = document.createElement('div');
            citeBox.style.marginTop = '0.75rem';
            citeBox.style.paddingTop = '0.5rem';
            citeBox.style.borderTop = '1px dashed rgba(255,255,255,0.05)';
            citeBox.style.fontSize = '0.75rem';
            citeBox.style.color = 'var(--text-light)';
            citeBox.innerHTML = `<strong>출처 인용:</strong> ` + citations.map(c => `<span class="citation" title="${c}">${c}</span>`).join(' ');
            contentDiv.appendChild(citeBox);
        }
        
        bubble.appendChild(contentDiv);
    } else {
        const contentDiv = document.createElement('div');
        contentDiv.textContent = text;
        bubble.appendChild(contentDiv);
    }

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    
    return bubble;
}

// Basic markdown format helper
function formatMarkdownResponse(text) {
    let formatted = text
        .replace(/---/g, '<hr style="border:none;border-top:1px solid var(--panel-border);margin:0.5rem 0;">')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:4px; font-size:0.85em;">$1</code>')
        .replace(/^&gt;\s(.+)/gm, '<blockquote style="border-left:3px solid var(--first-color);padding-left:0.75rem;color:var(--text-color-light);margin:0.5rem 0;">$1</blockquote>');

    return formatted;
}

/*==================== 로컬 검색 엔진 (API 불필요) ====================*/

// 한국어/영어 불용어 목록
const STOP_WORDS = new Set([
    '이','가','은','는','을','를','의','에','에서','로','으로','과','와','도','만',
    '까지','부터','이다','입니다','있다','있습니다','없다','없습니다','하다','합니다',
    '것','수','및','또는','그리고','때','후','전','더','위','아래','이런','저런',
    '어떤','무슨','어디','언제','누가','왜','어떻게','알려줘','알려주세요','설명',
    '설명해줘','설명해주세요','무엇','뭔가','좀','좀더','제발','부탁','궁금','해줘',
    '해주세요','대해','관해','관련','정보','내용','알고','싶어','싶습니다','뭐야',
    '뭐예요','있나요','있어','있어요','해','줘','주세요','알려','말해','말해줘',
    'the','a','an','is','are','was','were','be','have','has','do','does','did',
    'will','would','could','should','of','in','on','at','by','for','with','to'
]);

// 한국어 조사/어미 제거
function stripKoreanParticles(token) {
    const particles = [
        '에서도','으로부터','에게서','로부터','이라도','이라서','이라고','이라며',
        '에서','까지','부터','에게','한테','으로','로서','로써','이라','이고',
        '이며','이나','라고','라서','이다','입니다','이며','이고','이든','이든지',
        '에도','에는','에만','에게는','에서는','로는','로도','로만',
        '에','의','을','를','이','가','은','는','과','와','도','만','로','으로',
        '고','며','서','야','여','죠','죠','네','요','나','나요','는데','은데'
    ].sort((a, b) => b.length - a.length);

    for (const particle of particles) {
        if (token.endsWith(particle) && token.length > particle.length + 1) {
            return token.slice(0, token.length - particle.length);
        }
    }
    return token;
}

// 쿼리를 토큰으로 분리 (조사 제거 포함)
function tokenizeQuery(query) {
    return query.toLowerCase()
        .split(/[\s,，.。!?！？\-_\/\(\)\[\]「」『』【】]+/)
        .map(t => t.replace(/[^a-z0-9가-힣]/g, ''))
        .map(t => stripKoreanParticles(t))
        .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

// 텍스트에서 관련 문단 추출
function extractRelevantPassages(content, tokens, maxPassages = 5) {
    // 줄 단위로 분리 후 빈 줄/짧은 줄 제거
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 8);

    const scored = lines.map(line => {
        const lineLower = line.toLowerCase();
        let score = 0;
        const matchedTokens = [];
        tokens.forEach(token => {
            if (lineLower.includes(token)) {
                score += (lineLower.match(new RegExp(token, 'g')) || []).length;
                matchedTokens.push(token);
            }
        });
        return { line, score, matchedTokens: new Set(matchedTokens) };
    });

    // 점수 높은 순 정렬, 중복 유사 문장 제거
    const sorted = scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score);

    const selected = [];
    for (const item of sorted) {
        if (selected.length >= maxPassages) break;
        // 이미 선택된 것과 80% 이상 유사하면 스킵
        const isDup = selected.some(s => {
            const overlap = [...item.matchedTokens].filter(t => s.matchedTokens.has(t)).length;
            return overlap / Math.max(item.matchedTokens.size, s.matchedTokens.size, 1) > 0.8
                   && Math.abs(s.line.length - item.line.length) < 20;
        });
        if (!isDup) selected.push(item);
    }

    return selected.map(s => s.line);
}

// 정규식 특수문자 이스케이프
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 키워드 강조 (굵게)
function highlightKeywords(text, tokens) {
    let result = text;
    tokens.forEach(token => {
        const regex = new RegExp(`(${escapeRegex(token)})`, 'gi');
        result = result.replace(regex, '**$1**');
    });
    return result;
}

// 로컬 지식베이스 검색 메인 함수
function localSearch(query) {
    const tokens = tokenizeQuery(query);

    if (tokens.length === 0) {
        return {
            text: '검색어를 좀 더 구체적으로 입력해 주세요.\n예: *"부스터펌프 E02 에러"*, *"ISO9001 만료일"*, *"다단볼루트 가동 순서"*',
            citations: []
        };
    }

    const results = [];

    // 내장 지식베이스 검색
    activeSources.forEach(id => {
        const source = KnowledgeBase[id];
        if (!source) return;

        const contentLower = source.content.toLowerCase();
        let totalScore = 0;
        const uniqueMatched = new Set();

        tokens.forEach(token => {
            const count = (contentLower.match(new RegExp(token, 'g')) || []).length;
            if (count > 0) {
                totalScore += count;
                uniqueMatched.add(token);
            }
        });

        if (totalScore > 0) {
            const passages = extractRelevantPassages(source.content, tokens);
            results.push({
                name: source.name,
                score: totalScore * uniqueMatched.size, // 다양한 키워드 매칭 가중치
                passages
            });
        }
    });

    // 업로드 문서 검색
    uploadedSources.forEach(doc => {
        if (!doc.content) return;
        const contentLower = doc.content.toLowerCase();
        let totalScore = 0;
        const uniqueMatched = new Set();

        tokens.forEach(token => {
            const count = (contentLower.match(new RegExp(token, 'g')) || []).length;
            if (count > 0) { totalScore += count; uniqueMatched.add(token); }
        });

        if (totalScore > 0) {
            const passages = extractRelevantPassages(doc.content, tokens);
            results.push({
                name: doc.name + ' (업로드)',
                score: totalScore * uniqueMatched.size,
                passages
            });
        }
    });

    results.sort((a, b) => b.score - a.score);

    if (results.length === 0) {
        const activeNames = [];
        activeSources.forEach(id => { if (KnowledgeBase[id]) activeNames.push(KnowledgeBase[id].name); });
        return {
            text: `**"${query}"** 에 대한 관련 정보를 선택된 소스에서 찾지 못했습니다.\n\n검색된 소스: ${activeNames.join(', ') || '없음'}\n\n**다음을 시도해 보세요:**\n- 더 짧고 구체적인 키워드 사용 (예: "E02", "ISO", "마중물")\n- 좌측 패널에서 더 많은 소스 문서 활성화`,
            citations: []
        };
    }

    // 응답 텍스트 조합 (상위 3개 소스)
    let responseText = '';
    const citations = [];

    results.slice(0, 3).forEach((result, idx) => {
        citations.push(result.name);
        if (idx > 0) responseText += '\n\n---\n\n';
        responseText += `**[출처: ${result.name}]**\n\n`;
        result.passages.forEach(passage => {
            responseText += `${highlightKeywords(passage, tokens)}\n`;
        });
    });

    // 추가 소스 존재 시 안내
    if (results.length > 3) {
        const extra = results.slice(3).map(r => r.name).join(', ');
        responseText += `\n\n> 추가 관련 소스: ${extra}`;
    }

    return { text: responseText, citations };
}

function generateAiResponse(query) {
    const container = document.getElementById('chat-messages');

    // 타이핑 인디케이터
    const indicator = document.createElement('div');
    indicator.className = 'chat-bubble ai';
    indicator.id = 'temp-typing-indicator';
    indicator.innerHTML = `
        <div class="bubble-sender"><i class="ri-cpu-line"></i> 비에이텍 AI 어시스턴트</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;

    // 로컬 검색은 즉시 실행되지만 자연스러운 느낌을 위해 짧은 딜레이
    setTimeout(() => {
        indicator.remove();
        const result = localSearch(query);
        addMessageBubble('ai', result.text, result.citations);
    }, 600);
}

/*==================== SOURCE FILE UPLOADS (Simulation) ====================*/
function setupFileUpload() {
    const zone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('source-file-input');

    if (zone && fileInput) {
        zone.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                handleSimulatedFiles(files);
            }
        });

        // Drag events
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'var(--first-color)';
            zone.style.background = 'rgba(10, 61, 98, 0.04)';
        });

        zone.addEventListener('dragleave', () => {
            zone.style.borderColor = 'var(--panel-border)';
            zone.style.background = 'transparent';
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'var(--panel-border)';
            zone.style.background = 'transparent';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleSimulatedFiles(files);
            }
        });
    }
}

function handleSimulatedFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (uploadedSources.some(doc => doc.name === file.name)) {
            alert(`이미 업로드된 파일입니다: ${file.name}`);
            continue;
        }

        const sizeKb = Math.round(file.size / 1024);
        const newDoc = {
            id: 'up_' + Date.now() + '_' + i,
            name: file.name,
            size: `${sizeKb} KB`,
            content: ''
        };

        const isText = file.type.startsWith('text/') || /\.(txt|html|htm|csv|md)$/i.test(file.name);
        const isImage = file.type.startsWith('image/');

        if (isText) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newDoc.content = `파일명: ${file.name}\n\n${e.target.result}`;
                addMessageBubble('ai', `소스 문서 **[${file.name}]** (${sizeKb} KB)이 추가되었습니다.\n이제 이 파일의 내용을 키워드로 검색하실 수 있습니다.`);
            };
            reader.readAsText(file, 'UTF-8');
        } else if (isImage) {
            newDoc.content = `[이미지 파일: ${file.name}]`;
            addMessageBubble('ai', `이미지 **[${file.name}]** (${sizeKb} KB)이 추가되었습니다.\n※ 현재 로컬 검색 방식에서는 이미지 내용 분석이 지원되지 않습니다. 이미지의 텍스트 내용을 .txt 파일로 변환하여 업로드하시면 검색이 가능합니다.`);
        } else {
            newDoc.content = `파일명: ${file.name} (${sizeKb} KB)\n파일 형식: ${file.type || '알 수 없음'}`;
            addMessageBubble('ai', `**[${file.name}]** (${sizeKb} KB)이 추가되었습니다.\n※ PDF는 텍스트 직접 추출이 불가합니다. 내용을 .txt 형식으로 변환하여 업로드하시면 검색이 가능합니다.`);
        }

        uploadedSources.push(newDoc);
        renderUploadedSourceCard(newDoc);
    }

    updateActiveSourcesPill();
}

function renderUploadedSourceCard(doc) {
    const list = document.getElementById('sources-list');
    if (!list) return;

    const card = document.createElement('div');
    card.className = 'source-card checked';
    card.setAttribute('data-src-id', doc.id);
    
    card.innerHTML = `
        <div class="source-checkbox" style="background: var(--first-color); border-color: var(--first-color); color: #fff;"><i class="ri-check-line"></i></div>
        <div class="source-card-details">
            <span class="source-card-name" title="${doc.name}">${doc.name}</span>
            <span class="source-card-info">
                <i class="ri-file-text-line" style="color:var(--first-color);"></i> ${doc.size} | 사용자 업로드
            </span>
        </div>
    `;

    // Toggle logic for custom uploads
    card.addEventListener('click', () => {
        const isChecked = card.classList.contains('checked');
        if (isChecked) {
            card.classList.remove('checked');
            card.querySelector('.source-checkbox').style.background = 'transparent';
            card.querySelector('.source-checkbox').style.borderColor = 'var(--text-light)';
            card.querySelector('.source-checkbox').style.color = 'transparent';
            
            // Remove from uploadedSources session lookup if desired, or just flag
            uploadedSources = uploadedSources.filter(u => u.id !== doc.id);
            updateActiveSourcesPill();
            card.remove(); // Remove custom card on deselect for simplicity, or just keep it inactive
        }
    });

    list.appendChild(card);
    
    // Auto greeting in chat panel notifying upload success
    addMessageBubble('ai', `새로운 소스 문서 **[${doc.name}]**가 성공적으로 AI 지식베이스에 추가 및 분석되었습니다. 
이제 이 파일의 내용에 대해 질문하실 수 있습니다.`);
}
