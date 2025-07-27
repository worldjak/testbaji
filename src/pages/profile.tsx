/* eslint-disable @typescript-eslint/no-unused-vars */ 
import React from "react";
import Image from "next/image";
import bgImage from "../../public/member-header-bg.png";
import avatarImg from "../../public/Kevin-Pietersen.jpg";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import {
  FiRefreshCcw,
  FiEye,
  FiList,
  FiRepeat,
  FiBarChart2,
  FiMail,
  FiLogOut,
} from "react-icons/fi";
import { AiOutlineWhatsApp, AiOutlineMail } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa";
import { CameraIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<{
    username: string;
    vipPoints: number;
    balance: number;
    avatar?: string;
    fullname?: string;
    isKycVerified?: boolean;
  } | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        let username = undefined;
        if (typeof window !== "undefined") {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              username = user.username;
            } catch {}
          }
        }
        const url = username
          ? `/api/profile?username=${encodeURIComponent(username)}`
          : "/api/profile";
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white py-10">Loading profile...</div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  if (!profile) {
    return null;
  }
  return (
    <div className="md:hidden bg-[#121212] min-h-screen text-white flex flex-col">
      {/* Header */}
      <div className="relative w-full h-44 flex justify-center items-center flex-col">
        <Image
          src={bgImage}
          alt="Header bg"
          layout="fill"
          objectFit="cover"
          className="z-10"
        />
        <div className="flex flex-col justify-center items-center px-4 py-2 relative z-16 w-full h-full">
          <div className="w-full flex items-center">
            <div className="relative flex justify-center items-center">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="relative w-20 h-20 overflow-hidden rounded-full border-2 border-gray-700">
                  <Image
                    src={profile.avatar || avatarImg}
                    alt="avatar"
                    className="rounded-full border-2 border-gray-700 object-center object-cover"
                    fill
                  />
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !profile) return;
                    setUploading(true);
                    try {
                      const url = await uploadToCloudinary(file);
                      // Update avatar in DB
                      await fetch("/api/profile", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          username: profile.username,
                          avatar: url,
                        }),
                      });
                      setProfile({ ...profile, avatar: url });
                    } catch {
                      alert("Failed to upload image");
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                <CameraIcon className="absolute bottom-1 right-1 bg-gray-300 border-gray-500 rounded-full text-gray-800 p-1" />
                {uploading && (
                  <span className="absolute top-1 left-1 bg-black bg-opacity-60 text-xs text-white px-2 py-1 rounded">
                    Uploading...
                  </span>
                )}
              </label>
            </div>
            {profile.fullname ? (
              <div className="text-lg font-semibold w-full ml-2 flex gap-1 items-center">
                <p>{profile.fullname}</p>
                {profile.isKycVerified && (
                  <Image
                    src={"/verified.png"}
                    alt="Verified image"
                    width={30}
                    height={30}
                  />
                )}
              </div>
            ) : (
              <div className="text-lg font-semibold w-full ml-2 invisible">
                <p>Hello user</p>
              </div>
            )}
          </div>
          <div className="absolute bottom-8">
            <div className="ml-5 text-xs text-white flex items-center">
              VIP Points (VP) {profile.vipPoints}
              <button className="ml-2 bg-[#1E1E1E] px-2 py-0.5 rounded text-green-400 text-xs font-medium">
                My VIP &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-1 space-y-4">
        {/* Main Wallet */}
        <div className="bg-[#1E1E1E] rounded-md p-4 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-300">Main Wallet</span>
            <FiRefreshCcw className="text-gray-500" />
            <FiEye className="text-gray-500" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-yellow-400 font-semibold">
              ৳{profile.balance}
            </span>
          </div>
        </div>

        {/* Funds */}
        <SectionGroup title="Funds">
          <div className="grid grid-cols-2 gap-1">
            <button className="flex justify-center items-center flex-col gap-1 text-xs">
              <Image
                src={"/deposit.png"}
                width={30}
                height={30}
                alt="deposit"
                className="mr-2"
              />
              <p>Deposit</p>
            </button>
            <button className="flex justify-center items-center flex-col gap-1 text-xs">
              <Image src={"/pay.png"} width={30} height={30} alt="Withdraw" />
              <p>Withdraw</p>
            </button>
          </div>
        </SectionGroup>

        {/* History */}
        <SectionGroup title="History">
          <div className="grid grid-cols-3 gap-1">
            <ActionCard icon={FiList} label="Betting Records" />
            <ActionCard icon={FiRepeat} label="Turnover" />
            <ActionCard icon={FiBarChart2} label="Transaction Records" />
          </div>
        </SectionGroup>

        {/* Profile */}
        <SectionGroup title="Profile">
          <div className="grid grid-cols-4 gap-1">
            <Link href={"/personalinfo"}>
              <ActionCard icon={FaUserTie} label="Personal Info" />
            </Link>
            <button className="flex justify-center items-center flex-col gap-2 text-xs">
              <Image
                src={"/lock.png"}
                width={35}
                height={40}
                alt="Change password"
              />
              <p>Change Password</p>
            </button>
            <ActionCard icon={FiMail} label="Inbox" />
            <button className="flex justify-center items-center flex-col gap-2 text-xs">
              <Image src={"/refer.png"} width={35} height={35} alt="Referral" />
              <p>Referral</p>
            </button>
          </div>
        </SectionGroup>

        {/* Verification */}
        <SectionGroup title="Verification & Update info">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => router.push("/verify-document")}
              className="flex justify-center items-center flex-col gap-2 text-xs"
            >
              <Image src={"/id-card.png"} width={35} height={35} alt="KYC" />
              <p>KYC</p>
            </button>
            <button
              onClick={() => router.push("/change-personalinfo?type=fullname")}
              className="flex justify-center items-center flex-col gap-2 text-xs"
            >
              <Image
                src={"/rename.png"}
                width={35}
                height={35}
                alt="Full Name"
              />
              <p>Name & Birthday</p>
            </button>
            <button
              onClick={() => router.push("/change-personalinfo?type=phone")}
              className="flex justify-center items-center flex-col gap-2 text-xs"
            >
              <Image
                src={"/telephone.png"}
                width={35}
                height={35}
                alt="Phone"
              />
              <p>Phone</p>
            </button>
            <button
              onClick={() => router.push("/change-personalinfo?type=email")}
              className="flex justify-center items-center flex-col gap-2 text-xs"
            >
              <Image src={"/gmail.png"} width={35} height={35} alt="Email" />
              <p>Email</p>
            </button>
          </div>
        </SectionGroup>

        {/* Livechat service */}
        <SectionGroup title="Livechat Service">
          <div className="grid grid-cols-3 gap-1">
            <button className="flex justify-center items-center flex-col gap-2 text-xs">
              <Image src={"/cs.png"} width={35} height={35} alt="Cs link" />
              <p>CS Link</p>
            </button>
            <button className="flex justify-center items-center flex-col gap-2 text-xs">
              <Image
                src={"/telegram.png"}
                width={35}
                height={35}
                alt="Cs link"
              />
              <p>Telegram</p>
            </button>
          </div>
        </SectionGroup>

        {/* Contact Us */}
        <SectionGroup title="Contact Us">
          <div className="grid grid-cols-3 gap-1">
            <ContactCard
              icon={AiOutlineWhatsApp}
              label="Whatsapp"
              color="#25D366"
              href="https://wa.me/your-number"
            />
            <button className="flex justify-center items-center flex-col gap-2 text-xs">
              <Image
                src={"/gmail-old.png"}
                width={35}
                height={35}
                alt="contact email"
              />
              <p>Email</p>
            </button>
            <button className="flex justify-center items-center flex-col gap-2 text-xs">
              <Image
                src={"/facebook.png"}
                width={35}
                height={35}
                alt="Facebook"
              />
              <p>Email</p>
            </button>
          </div>
        </SectionGroup>

        {/* Log out */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/");
          }}
          className="w-full flex items-center justify-center py-3 text-sm text-gray-400 border-t border-gray-700"
        >
          <FiLogOut className="mr-2" /> Log out
        </button>
      </div>
    </div>
  );
}

interface SectionGroupProps {
  title: string;
  children: React.ReactNode;
}
function SectionGroup({ title, children }: SectionGroupProps) {
  return (
    <div className="bg-[#1E1E1E] rounded-md overflow-hidden">
      <div className="flex items-center p-2 border-b border-gray-700">
        <span className="w-1 h-5 bg-green-400 inline-block mr-2" />
        <span className="text-sm font-medium text-gray-300">{title}</span>
      </div>
      <div className="p-4 bg-[#242731]">{children}</div>
    </div>
  );
}

interface ActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: boolean;
}
function ActionCard({ icon: Icon, label, badge }: ActionCardProps) {
  return (
    <button className="relative bg-[#242731] rounded-md p-1 flex flex-col items-center justify-center">
      {badge && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
      )}
      <Icon className="text-white text-2xl mb-3" />
      <span className="text-xs text-white text-center font-semibold">
        {label}
      </span>
    </button>
  );
}

interface ContactCardProps {
  icon: React.ComponentType<{
    style?: React.CSSProperties;
    className?: string;
  }>;
  label: string;
  color: string;
  href: string;
}
function ContactCard({ icon: Icon, label, color, href }: ContactCardProps) {
  return (
    <a
      href={href}
      className="bg-[#242731] rounded-md p-4 flex flex-col items-center"
    >
      <Icon style={{ color }} className="text-2xl mb-2" />
      <span className="text-xs text-gray-300">{label}</span>
    </a>
  );
}
