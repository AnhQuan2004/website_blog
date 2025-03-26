
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BlurImage from '@/components/ui/BlurImage';

const About = () => {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Founder & Editor-in-Chief',
      bio: 'John has over 10 years of experience in technology journalism. He founded Tech Insights to help make complex tech topics accessible to everyone.',
      avatar: 'https://i.pravatar.cc/300?u=john',
      social: {
        twitter: '#',
        github: '#',
        linkedin: '#',
        email: 'john@example.com'
      }
    },
    {
      name: 'Jane Smith',
      role: 'Senior Writer',
      bio: 'Jane specializes in AI and machine learning topics. She has a PhD in Computer Science and loves breaking down complex concepts into simple explanations.',
      avatar: 'https://i.pravatar.cc/300?u=jane',
      social: {
        twitter: '#',
        github: '#',
        linkedin: '#',
        email: 'jane@example.com'
      }
    },
    {
      name: 'Robert Johnson',
      role: 'Cybersecurity Expert',
      bio: 'Robert has worked in cybersecurity for over 15 years. He writes about security best practices, privacy concerns, and emerging threats.',
      avatar: 'https://i.pravatar.cc/300?u=robert',
      social: {
        twitter: '#',
        github: '#',
        linkedin: '#',
        email: 'robert@example.com'
      }
    }
  ];

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="content-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Tech Insights</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make technology more accessible through insightful, 
            well-researched, and easy-to-understand content.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Tech Insights was founded in 2020 with a simple goal: make technology more accessible to everyone. 
                We believe that understanding technology is increasingly important in today's digital world.
              </p>
              <p className="text-muted-foreground mb-4">
                What started as a small blog has grown into a platform with thousands of readers who come to us for clear, 
                concise, and trustworthy information about the latest in technology, web development, cybersecurity, and more.
              </p>
              <p className="text-muted-foreground">
                Every article we publish is carefully researched and written to ensure accuracy and clarity, 
                regardless of the reader's technical background.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden">
              <BlurImage
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Our team working"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Cover Section */}
      <section className="py-16 bg-secondary/30">
        <div className="content-container">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Cover</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Web Development',
                description: 'The latest trends, frameworks, and best practices in web development.',
                icon: '🌐'
              },
              {
                title: 'Artificial Intelligence',
                description: 'Insights into AI advancements, machine learning, and practical applications.',
                icon: '🤖'
              },
              {
                title: 'Cybersecurity',
                description: 'Security best practices, news about threats, and protection guides.',
                icon: '🔒'
              },
              {
                title: 'Emerging Tech',
                description: 'Quantum computing, blockchain, and other cutting-edge technologies.',
                icon: '🚀'
              }
            ].map((topic, index) => (
              <div key={index} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{topic.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                <p className="text-muted-foreground">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="content-container">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <p className="text-muted-foreground text-sm mb-6">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a href={member.social.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href={member.social.github} className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={18} />
                  </a>
                  <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href={`mailto:${member.social.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="content-container text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Join Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We're always looking for passionate writers who can explain complex technology topics in simple terms.
            If that sounds like you, we'd love to hear from you!
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/articles">Read Our Articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
