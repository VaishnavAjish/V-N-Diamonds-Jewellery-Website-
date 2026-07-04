import React from 'react';
import Image from 'next/image';

const team_data = [
  {
    id: 1,
    img: '/assets/img/users/user-2.jpg',
    name: 'Vipul Maheshwari',
  },
  {
    id: 2,
    img: '/assets/img/users/user-3.jpg',
    name: 'Nidhi Vipul Maheshwari',
  },
  {
    id: 3,
    img: '/assets/img/users/user-4.jpg',
    name: 'Prakhar Maheshwari',
  }
];

const OurTeamArea = () => {
  const [teamMembers, setTeamMembers] = React.useState(team_data);

  React.useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/settings/storefront')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.teamMembers?.length > 0) {
          setTeamMembers(data.data.teamMembers);
        }
      })
      .catch(err => console.error("Failed to load storefront settings", err));
  }, []);

  return (
    <>
      <style>{`
        .team-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 20px 120px;
          background-color: #fdfdfd;
        }

        .team-title {
          text-align: center;
          font-size: 18px;
          font-weight: 800;
          color: #1e3a5f;
          margin-bottom: 60px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .team-card {
          position: relative;
          overflow: hidden;
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          aspect-ratio: 4 / 5;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .team-card:nth-child(1) { animation-delay: 0.3s; }
        .team-card:nth-child(2) { animation-delay: 0.5s; }
        .team-card:nth-child(3) { animation-delay: 0.7s; }

        .team-img-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .team-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .team-card:hover .team-img-wrapper img {
          transform: scale(1.05);
        }

        .team-info {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 25px 20px;
          background: rgba(30, 30, 30, 0.85);
          text-align: center;
          transition: background 0.4s ease;
          backdrop-filter: blur(4px);
        }

        .team-card:hover .team-info {
          background: rgba(30, 58, 95, 0.95);
        }

        .team-name {
          color: #ffffff;
          font-size: 19px;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.5px;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <section className="team-area" style={{ backgroundColor: '#fdfdfd' }}>
        <div className="team-container">
          <h2 className="team-title">Our Team</h2>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={member.id || index} className="team-card">
                <div className="team-img-wrapper">
                  <Image 
                    src={member.img || '/assets/img/users/user-2.jpg'} 
                    alt={member.name || 'Team Member'} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="team-info">
                  <h4 className="team-name">{member.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default OurTeamArea;
