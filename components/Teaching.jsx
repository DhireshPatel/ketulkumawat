const teachingItems = [
    { icon: '🏥', label: 'NEET Faculty' },
    { icon: '📊', label: 'JEE Faculty' },
    { icon: '🔬', label: 'CSIR NET / JRF / SRF' },
    { icon: '📐', label: 'GATE Chemistry' },
    { icon: '🎓', label: 'CGSET Coaching' },
    { icon: '⭐', label: 'DST INSPIRE Mentoring' },
    { icon: '🧪', label: 'Chemical Sciences Research' },
    { icon: '📖', label: 'Published Author' },
]

export default function Teaching() {
    return (
        <section id="teaching">
            <div className="section-inner">
                <div className="section-label">Academic Expertise</div>
                <h2 className="section-title">Teaching &amp; Mentorship</h2>
                <p className="section-sub">Beyond research — guiding students through competitive examinations and shaping the next generation of scientists.</p>
                <div className="teach-grid">
                    {teachingItems.map((item, i) => (
                        <div className="teach-pill reveal" key={i}>
                            <span>{item.icon}</span> {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
