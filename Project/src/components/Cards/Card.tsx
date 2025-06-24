import React, { useState } from "react";

interface SingleCardProps {
  image: string;
  CardDescription: string;
  CardTitle: string;
  titleHref?: string;
  price: number;
  discount: number;
  rating: number
}

const SingleCard: React.FC<SingleCardProps> = ({
  image,
  CardDescription,
  CardTitle,
  titleHref,
  price,
  discount,
  rating
}) => {
  const [hoveredAvatar, setHoveredAvatar] = useState<boolean | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <>
      <div className="overflow-hidden h-80 rounded-lg dark:bg-boxdark bg-white shadow-md duration-300">
        <img
          src={image}
          alt="Placeholder"
          className="w-full h-45 rounded-xl hover:shadow-lg"
        />
        <div className="p-4 text-left">
          <div className="flex justify-between items-center m-2">
            <div className="flex flex-col ">
              <a
                href={titleHref ?? "/#"}
                className="uppercase tracking-wide text-sm font-semibold dark:text-white text-black hover:text-primary"
              >
                {CardTitle}
              </a>
              <span className="dark:text-white text-dark text-left ml-1">
                <span className="font-bold"> $ {discount} </span>({price})
              </span>
            </div>
            <button
              onClick={handleLikeClick}
              className={`w-10 h-10 p-1.5 flex items-center justify-center rounded-full  ${
                isLiked ? "dark:bg-sidedark bg-gray" : "dark:bg-sidedark bg-gray"
              }`}
            >
              {isLiked ? (
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 24 24"
                  fill=" none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
                    stroke="#AB2117"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
                    stroke="#3d4d60"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            {/* Star icon */}
            <div className="flex items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.36946 1.1475L10.7794 3.9675C10.9694 4.3575 11.4794 4.7275 11.9094 4.8075L14.4595 5.2275C16.0895 5.4975 16.4694 6.6775 15.2994 7.8575L13.3094 9.8475C12.9794 10.1775 12.7895 10.8275 12.8995 11.2975L13.4694 13.7575C13.9194 15.6975 12.8794 16.4575 11.1694 15.4375L8.77943 14.0175C8.34943 13.7575 7.62944 13.7575 7.19944 14.0175L4.80943 15.4375C3.09943 16.4475 2.05944 15.6975 2.50944 13.7575L3.07945 11.2975C3.18945 10.8375 2.99945 10.1875 2.66945 9.8475L0.679455 7.8575C-0.490545 6.6875 -0.110549 5.5075 1.51945 5.2275L4.06944 4.8075C4.49944 4.7375 5.00944 4.3575 5.19944 3.9675L6.60945 1.1475C7.35945 -0.3825 8.59946 -0.3825 9.36946 1.1475Z"
                  fill="#FFD910"
                />
              </svg>
              <span className="text-gray-500 ml-1">{rating}</span>
            </div>

            {/* Avatars section */}
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((avatarIndex) => (
                <div
                  key={avatarIndex}
                  className="relative -ml-3"
                  onMouseEnter={() => setHoveredAvatar(true)}
                  onMouseLeave={() => setHoveredAvatar(null)}
                >
                  <img
                    className={`h-8 w-8 rounded-full cursor-pointer transition duration-300 transform hover:scale-110 ${
                      hoveredAvatar ? "z-8" : "z-0"
                    }`}
                    src={`/images/user/user-0${avatarIndex}.png`}
                    alt={`Avatar ${avatarIndex}`}
                  />
                  {hoveredAvatar && (
                    <span className="absolute bottom-0 right-0 block h-2 w-2 bg-green-400 border-2 border-white rounded-full"></span>
                  )}
                </div>
              ))}

              
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

interface CardListProps {
  cards: SingleCardProps[];
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
  return (
    <>
      <div className="p-3">
        {cards.map((card, index) => (
          <SingleCard key={index} {...card} />
        ))}
      </div>
    </>
  );
};

export { SingleCard, CardList };
