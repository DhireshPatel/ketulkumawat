const educationData = [
    {
        year: 'Pursuing',
        degree: 'Doctor of Philosophy (Ph.D.)',
        // pursuing: true,
        field: 'Chemical Sciences',
        univ: 'Jai Narain Vyas University (JNVU), Jodhpur',
        // icon: '🎓',
    },
    {
        year: 'Completed',
        degree: 'Master of Science (M.Sc.)',
        field: 'Chemistry',
        univ: 'University of Kota, Kota',
        // icon: '🔬',
    },
    {
        year: 'Completed',
        degree: 'Bachelor of Education (B.Ed.)',
        field: 'Education',
        univ: 'University of Rajasthan, Jaipur',
        // icon: '📚',
    },
    {
        year: 'Completed',
        degree: 'Bachelor of Science (B.Sc.)',
        field: 'Chemistry, Botany & Zoology (CBZ)',
        univ: 'University of Rajasthan, Jaipur',
        // icon: '🧪',
    },
]

export default function Education() {
    return (
        <section id="education">
            <div className="section-inner">
                <div className="section-label">Academic Journey</div>
                <h2 className="section-title">Education</h2>
                <div className="edu-list">
                    {educationData.map((edu, i) => (
                        <div className="edu-item reveal" key={i}>
                            <div className="edu-year">{edu.year}</div>
                            <div className="edu-content">
                                <div className="edu-degree">
                                    {edu.degree}
                                    {edu.pursuing && (
                                        <span className="pursuing-tag">Pursuing</span>
                                    )}
                                </div>
                                <div className="edu-field">{edu.field}</div>
                                <div className="edu-univ">{edu.univ}</div>
                            </div>
                            {/* <div className="edu-icon">{edu.icon}</div> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
