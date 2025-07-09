# React Todo App with Chat Integration

React + Vite 기반의 Todo 애플리케이션으로, 채팅 기능이 통합된 프로젝트입니다.

## 프로젝트 구조

```
src/
├── App.jsx                 # 메인 애플리케이션 컴포넌트
├── main.jsx               # 애플리케이션 진입점
├── index.css              # 전역 스타일 (Tailwind CSS)
├── components/            # 재사용 가능한 컴포넌트들
│   ├── TodoItem.jsx       # 개별 Todo 아이템 컴포넌트
│   ├── TodoListSection.jsx # Todo 목록 섹션 컴포넌트
│   ├── TodoWriteForm.jsx  # Todo 작성 폼 컴포넌트
│   └── ChatSidebar.jsx    # 채팅 사이드바 컴포넌트
├── hooks/                 # 커스텀 훅들
│   └── useTodos.js        # Todo 관련 로직을 처리하는 커스텀 훅
├── contexts/              # React Context API
│   ├── TodoContext.jsx    # Todo 상태 관리 컨텍스트
│   └── ChatContext.jsx    # 채팅 상태 관리 컨텍스트
└── assets/                # 정적 자산들
    └── react.svg
```

## 주요 기능

### Todo 관리
- Todo 아이템 추가, 수정, 삭제
- 완료 상태 토글
- 실시간 Todo 목록 업데이트

### 채팅 기능
- 실시간 채팅 인터페이스
- 사이드바 형태의 채팅 UI
- 채팅 상태 관리

### 기술 스택
- **React 18**: 사용자 인터페이스 구축
- **Vite**: 빠른 개발 환경 및 빌드 도구
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Context API**: 전역 상태 관리
- **Custom Hooks**: 로직 재사용성 향상

## 개발 환경 설정

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 미리보기
```bash
npm run preview
```

## 컴포넌트 구조

### App.jsx
- 메인 애플리케이션 레이아웃
- Context Provider 설정
- 전체 애플리케이션 상태 관리

### TodoListSection.jsx
- Todo 목록 전체를 관리하는 컴포넌트
- TodoItem 컴포넌트들을 렌더링
- 목록 정렬 및 필터링 기능

### TodoItem.jsx
- 개별 Todo 아이템 표시
- 완료 상태 토글 기능
- 수정 및 삭제 기능

### TodoWriteForm.jsx
- 새로운 Todo 작성 폼
- 입력 유효성 검사
- Todo 추가 기능

### ChatSidebar.jsx
- 채팅 인터페이스
- 메시지 전송 및 수신
- 채팅 히스토리 관리

## 상태 관리

### TodoContext
- Todo 목록 상태 관리
- Todo CRUD 작업 함수들
- 전역 Todo 상태 제공

### ChatContext
- 채팅 메시지 상태 관리
- 채팅 관련 액션 함수들
- 채팅 UI 상태 관리

## 커스텀 훅

### useTodos
- Todo 관련 비즈니스 로직
- 로컬 스토리지 연동
- Todo 상태 변경 함수들
