import React from 'react';
import { useNavigate } from 'react-router-dom';

const personalityTypes = [
  {
    id: "INFP",
    title: "The Healer",
    description: "INFPs are imaginative idealists, guided by their own core values and beliefs. To a Healer, possibilities are paramount; the reality of the moment is only of passing concern. They see potential for a better future, and pursue truth and meaning with their own flair.",
    color: "#6B4EFF"
  },
  {
    id: "INTJ",
    title: "The Mastermind",
    description: "INTJs are analytical problem-solvers, eager to improve systems and processes with their innovative ideas. They have a talent for seeing possibilities for improvement, whether at work, at home, or in themselves.",
    color: "#a855f7"
  },
  {
    id: "INFJ",
    title: "The Counselor",
    description: "INFJs are creative nurturers with a strong sense of personal integrity and a drive to help others realize their potential. Creative and dedicated, they have a talent for helping others with original solutions to their personal challenges.",
    color: "#8b5cf6"
  },
  {
    id: "INTP",
    title: "The Architect",
    description: "INTPs are philosophical innovators, fascinated by logical analysis, systems, and design. They are preoccupied with theory, and search for the universal law behind everything they see. They want to understand the unifying themes of life, in all their complexity.",
    color: "#6366f1"
  },
  {
    id: "ENFP",
    title: "The Champion",
    description: "ENFPs are people-centered creators with a focus on possibilities and a contagious enthusiasm for new ideas, people and activities. Energetic, warm, and passionate, ENFPs love to help other people explore their creative potential.",
    color: "#ec4899"
  },
  {
    id: "ENTJ",
    title: "The Commander",
    description: "ENTJs are strategic leaders, motivated to organize change. They are quick to see inefficiency and conceptualize new solutions, and enjoy developing long-range plans to accomplish their vision. They excel at logical reasoning and are usually articulate and quick-witted.",
    color: "#ef4444"
  },
  {
    id: "ENTP",
    title: "The Visionary",
    description: "ENTPs are inspired innovators, motivated to find new solutions to intellectually challenging problems. They are curious and clever, and seek to comprehend the people, systems, and principles that surround them.",
    color: "#f97316"
  },
  {
    id: "ENFJ",
    title: "The Teacher",
    description: "ENFJs are idealist organizers, driven to implement their vision of what is best for humanity. They often act as catalysts for human growth because of their ability to see potential in other people and their charisma in persuading others to their ideas.",
    color: "#f43f5e"
  },
  {
    id: "ISFJ",
    title: "The Protector",
    description: "ISFJs are industrious caretakers, loyal to traditions and organizations. They are practical, compassionate, and caring, and are motivated to provide for others and protect them from the perils of life.",
    color: "#06b6d4"
  },
  {
    id: "ISFP",
    title: "The Composer",
    description: "ISFPs are gentle caretakers who live in the present moment and enjoy their surroundings with cheerful, low-key enthusiasm. They are flexible and spontaneous, and like to go with the flow to enjoy what life has to offer.",
    color: "#10b981"
  },
  {
    id: "ISTJ",
    title: "The Inspector",
    description: "ISTJs are responsible organizers, driven to create and enforce order within systems and institutions. They are neat and orderly, inside and out, and tend to have a procedure for everything they do.",
    color: "#3b82f6"
  },
  {
    id: "ISTP",
    title: "The Craftsperson",
    description: "ISTPs are observant artisans with an understanding of mechanics and an interest in troubleshooting. They approach their environments with a flexible logic, looking for practical solutions to the problems at hand.",
    color: "#0d9488"
  },
  {
    id: "ESFJ",
    title: "The Provider",
    description: "ESFJs are conscientious helpers, sensitive to the needs of others and energetically dedicated to their responsibilities. They are highly attuned to their emotional environment and attentive to both the feelings of others and the perception others have of them.",
    color: "#0ea5e9"
  },
  {
    id: "ESFP",
    title: "The Performer",
    description: "ESFPs are vivacious entertainers who charm and engage those around them. They are spontaneous, energetic, and fun-loving, and take pleasure in the things around them: food, clothes, nature, animals, and especially people.",
    color: "#fbbf24"
  },
  {
    id: "ESTJ",
    title: "The Supervisor",
    description: "ESTJs are hardworking traditionalists, eager to take charge in organizing projects and people. Orderly, rule-abiding, and conscientious, ESTJs like to get things done, and tend to go about projects in a systematic, methodical way.",
    color: "#0369a1"
  },
  {
    id: "ESTP",
    title: "The Dynamo",
    description: "ESTPs are energetic thrillseekers who are at their best when putting out fires, whether literal or metaphorical. They bring a sense of dynamic energy to their interactions with others and the world around them.",
    color: "#fb923c"
  }
];

export default function About16Personalities() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-indigo-600 font-bold flex items-center gap-2 mb-6 sm:mb-8 transition-colors text-sm"
        >
          ← Back to Dashboard
        </button>
        
        <h1 className="heading-hero">
          Understanding the <span className="brand-shimmer">16 Architectures</span>
        </h1>
        
        <div className="glass-card border-indigo-100/50 bg-white/50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 shadow-sm mb-12 sm:mb-16 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-50 rounded-full blur-3xl -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
          <p className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed relative z-10 max-w-4xl font-medium">
            In order to better understand people’s common similarities and differences, Isabel Briggs Myers and her mother Katharine Briggs built on the work of psychologist Carl Jung to develop a system of categorizing human behavior. They landed on four key dimensions that people could express as preferences in the way they manage their energy, process information, make decisions, and structure their day-to-day lives. Each of these preferences is represented by a letter, and together these preferences, denoted by four letters, make up your Myers Briggs personality type.
          </p>
        </div>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-900 mb-8 pl-4 border-l-4 border-indigo-600">The 16 Personality Types</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {personalityTypes.map((type) => (
            <div key={type.id} className="glass-card border-transparent hover:border-indigo-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group pointer-events-none sm:pointer-events-auto">
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl mb-5 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: type.color }}
              >
                {type.id}
              </div>
              <h3 className="text-slate-900 font-display font-bold text-lg mb-1">{type.title}</h3>
              <p className="text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-4 opacity-80">{type.id}</p>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass-card border-indigo-100 bg-indigo-50/30 rounded-[2.5rem] p-8 sm:p-12 text-center mt-8 sm:mt-12 backdrop-blur-sm">
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4 sm:mb-6">Ready to discover <br className="sm:hidden" /> your type?</h3>
        <p className="text-slate-500 mb-8 sm:mb-10 max-w-xl mx-auto font-medium text-sm sm:text-base px-4">Take the assessment and see which of these 16 unique profiles matches your natural preferences.</p>
        <button 
          onClick={() => navigate('/test-intro')}
          className="btn-primary py-4 px-10 rounded-xl shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
        >
          Start Assessment →
        </button>
      </div>
    </div>
  );
}
