# APRAcademy 🧠📚

A comprehensive web application designed to help psychology students prepare for the National Psychology Examination in Australia. Built with Next.js, TypeScript, and Tailwind CSS.

> **VCE English** is maintained in a separate codebase: **`../vce-english-app`** (own Next.js app + own Vercel project). Do not mix it with this repo’s deployments.
>
> **Psychology vs nursing:** the same codebase can run **both** locally (`NEXT_PUBLIC_EXAM_SUITE` unset or `all`). On Vercel, use **two projects** with `NEXT_PUBLIC_EXAM_SUITE=psychology` vs `nursing` so each domain only serves one exam. See **`docs/DEPLOYMENTS.md`**.

## 🌟 Features

### 📊 Dashboard
- **Study Overview**: Track your progress across all exam domains
- **Smart Recommendations**: Personalized study suggestions based on your performance
- **Exam Countdown**: Visual countdown to your exam date
- **Quick Actions**: Easy access to all study features
- **Progress Statistics**: Hours studied, questions answered, study streak, and readiness score

### 🗂️ Flashcards
- **35+ Production-Ready Questions**: Based on official psychology exam curriculum
- **Multiple Choice Format**: Realistic exam-style questions with explanations
- **Spaced Repetition**: Intelligent review scheduling based on mastery levels
- **Domain Filtering**: Study by Ethics, Assessment, Interventions, or Communication
- **Search & Filter**: Find specific topics or difficulty levels
- **Progress Tracking**: Monitor your mastery of each concept

### 📝 Practice Questions
- **Real Exam Scenarios**: Questions based on official sample questions
- **Two Modes**: Practice mode with immediate feedback or timed exam simulation
- **Detailed Explanations**: Learn from comprehensive answer explanations
- **Performance Analytics**: Track your scores and identify weak areas
- **Review Mode**: Go back through completed quizzes to review answers

### 📚 Study Materials
- **Comprehensive Resources**: Organized by exam domains
- **Official Content**: Based on APS Code of Ethics and curriculum requirements
- **Search Functionality**: Find specific topics quickly
- **Bookmark System**: Save important materials for later review
- **Progress Tracking**: Monitor completion of study materials

### 📈 Progress Tracking
- **Detailed Analytics**: Visual charts and statistics
- **Achievement System**: Unlock badges for study milestones
- **Weak Area Identification**: Focus on areas needing improvement
- **Study Streak Tracking**: Maintain consistent study habits
- **Readiness Assessment**: Get an estimated exam readiness score

## 🎯 Exam Domains Covered

### 1. Ethics
- APS Code of Ethics principles
- Legal obligations and mandatory reporting
- Professional boundaries and conflicts of interest
- Informed consent and confidentiality
- Cultural competence and diversity

### 2. Assessment
- Key assessment tools (WAIS-IV, WISC-V, DASS-42, PAI, K-10, SDQ)
- DSM-5 diagnostic criteria
- Risk assessment procedures
- Test selection and interpretation
- Cultural responsiveness in assessment

### 3. Interventions
- Evidence-based therapies (CBT, DBT, Motivational Interviewing)
- Psychopharmacology basics
- Therapeutic alliance and client engagement
- Exposure therapy and behavioral activation
- Cultural adaptation of interventions

### 4. Communication
- Professional report writing
- Electronic communication ethics
- Record keeping standards
- Referral procedures
- Cultural responsiveness in communication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MunasheChitima/psychexamapp.git
   cd psychexamapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Product-specific app routes

- Psychology app: [http://localhost:3000/psych/dashboard](http://localhost:3000/psych/dashboard)
- Nursing app: [http://localhost:3000/nursing/dashboard](http://localhost:3000/nursing/dashboard)
- Legacy/default dashboard route remains available at [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### Building for Production

```bash
npm run build
npm start
```

### Database migrations

Apply new SQL migrations after pulling (adds Stripe webhook idempotency, organic analytics table, and indexes):

```bash
npx prisma migrate deploy
```

For local development you may use `npx prisma db push` instead; production should use `migrate deploy` once the database history is aligned.

**Production:** set `NEXTAUTH_SECRET` (16+ chars). Guest token signing requires it in production (`packages/platform`).

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks with localStorage persistence
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 📱 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline Capability**: Study materials available offline
- **Data Persistence**: Progress saved locally
- **Accessibility**: WCAG compliant design
- **Performance**: Optimized for fast loading

## 🎓 Content Sources

This app is built using content from official psychology examination materials:

- **APS Code of Ethics** (2007)
- **Psychology Board Sample Questions**
- **National Psychology Examination Curriculum** (August 2018)
- **Official Reading List and Guidelines**

All questions and content are based on real exam requirements and professional standards.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Australian Psychological Society (APS)
- Psychology Board of Australia
- Next.js and React communities
- All contributors and beta testers

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Check the documentation
- Review the FAQ section

---

**Good luck with your psychology exam preparation! 🧠✨**

*This app is designed to supplement your study materials and should be used alongside official resources and professional supervision.*
