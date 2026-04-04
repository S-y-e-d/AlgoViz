type CardProps = {
    children: React.ReactNode;
    image?: React.ReactNode; 
    onClick?: () => void;
};
export const HomeCard: React.FC<CardProps> = ({children, image, onClick} : CardProps) => {
    return (
        <div className="home-card" onClick={onClick}>
        {image && <div className="card-image">{image}</div>} 
        {children}
        </div>
    );

}

export default HomeCard;