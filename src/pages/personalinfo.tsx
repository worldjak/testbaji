/* eslint-disable @typescript-eslint/no-require-imports */ 
import React from "react";
import Image from "next/image";
import { ChevronUp, User, Cake, Phone, Mail, ArrowLeft } from "lucide-react";

import bgImage from "../../public/gradient-bg.jpg";
import badgeImg from "../../public/vip-badge.png";
import { IoInformation } from "react-icons/io5";
import { useRouter } from "next/router";
import moment from "moment";
import Link from "next/link";

export default function PersonalInfoPage() {
  const [profile, setProfile] = React.useState<{
    username: string;
    vipPoints: number;
    createdAt?: string;
    fullname?: string;
    phone?: string;
    phones?: {
      number: string;
      verified?: boolean;
      primary?: boolean;
    }[];
    email?: string;
    isEmailVerified?: boolean;
    birthday?: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
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
      if (!username) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const url = `/api/profile?username=${encodeURIComponent(username)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center text-white py-10">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  if (!profile) return null;

  return (
    <div className="md:hidden bg-[#1E1F29] min-h-screen text-white">
      <header className="flex items-center justify-between bg-[#14805e] h-12 relative px-5">
        <Link href={"/profile"}>
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-lg font-medium text-white">Personal Information</h1>
        <div />
      </header>

      {/* PROFILE HEADING */}
      <div className="relative w-full h-46">
        <Image src={bgImage} alt="header bg" layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-radial from-[#000000e5] to-[#1a1a1a75] bg-opacity-40 flex flex-col items-center justify-center">
          <Image src={badgeImg} alt="VIP badge" width={72} height={72} />
          <h2 className="mt-3 text-xl font-semibold">{profile.username}</h2>
          <p className="text-gray-400 text-sm">
            Date Registered :{" "}
            {moment(profile.createdAt).format("DD/MM/YYYY hh:mm a") || "-"}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* VIP PANEL */}
        <div className="bg-[#1a1a1a] rounded-md flex items-center justify-between px-4 py-3">
          <span className="text-sm text-gray-200">VIP Points (VP)</span>
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-white mx-4">
              {profile.vipPoints}
            </span>
            <button className="text-[#14805e] text-sm font-medium">
              My VIP &gt;&gt;
            </button>
          </div>
        </div>

        {/* INFO ALERT (conditionally shown) */}
        {(() => {
          const hasFullname = !!profile.fullname;
          const hasBirthday = !!profile.birthday;
          const primary = (profile.phones || []).find((p) => p.primary);
          const primaryVerified = primary && primary.verified;
          const emailVerified = !!profile.isEmailVerified;
          if (!(hasFullname && hasBirthday && primaryVerified && emailVerified)) {
            return (
              <div className="bg-[#242731] rounded-md p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <IoInformation size={20} className="text-[#14805e]" />
                    <p className="text-sm text-gray-200 leading-snug">
                      Please complete the verification below before you proceed with
                      the withdrawal request.
                    </p>
                  </div>
                  <ChevronUp size={20} className="text-gray-400" />
                </div>
                <div className="border-t border-gray-700 pt-2 flex items-center">
                  <span className="w-1 h-5 bg-green-400 inline-block mr-2" />
                  <span className="text-sm font-medium text-green-400">
                    Personal Info
                  </span>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* FORM PANEL */}
        <div className="bg-[#242731] rounded-md p-4 space-y-4">
          <InfoRow
            icon={User}
            label="Full Name"
            value={profile.fullname}
            button={{
              text: profile.fullname ? "" : "Add",
              color: "bg-[#14805e]",
            }}
          />
          {profile.phones &&
            profile.phones.map((phone, index) => (
              <InfoRow
                key={index}
                icon={Phone}
                label={
                  phone.primary
                    ? "Phone Number (Primary)"
                    : `Phone Number ${index + 1}`
                }
                value={phone.number}
                button={{
                  text: phone.verified ? "Verified" : "Not Verified",
                  color: phone.verified ? "bg-green-500" : "bg-red-500",
                  onClick: !phone.verified
                    ? undefined // handled in InfoRow
                    : undefined,
                }}
              />
            ))}

          {/* Add another Phone Number button logic */}
          {(() => {
            const phones = profile.phones || [];
            const primary = phones.find((p) => p.primary);
            const primaryVerified = primary && primary.verified;
            if (primaryVerified && phones.length < 3) {
              return (
                <div className="flex justify-center my-2">
                  <button
                    className="flex items-center border border-[#14805e] text-[#14805e] rounded-md px-4 py-2 text-sm font-medium w-full justify-center bg-transparent hover:bg-[#14805e]/10 transition"
                    onClick={() => {
                      const router = require("next/router").useRouter();
                      router.push("/add-phone");
                    }}
                    type="button"
                  >
                    <span className="text-xl mr-2">+</span> Add another Phone
                    Number
                  </button>
                </div>
              );
            }
            return null;
          })()}

          <InfoRow
            icon={Mail}
            label="Email"
            value={profile.email}
            button={{
              text: !profile.email
                ? "Add"
                : !profile.isEmailVerified
                ? "Not Verified"
                : profile.isEmailVerified
                ? "Verified"
                : "",
              color: profile.isEmailVerified ? "bg-green-500" : "bg-red-500",
            }}
          />
          <InfoRow
            icon={Cake}
            label="Birthday"
            value={profile.birthday}
            button={{
              text: profile.birthday ? "" : "Add",
              color: "bg-[#14805e]",
            }}
          />
        </div>
      </div>
    </div>
  );
}

type ButtonProps = { text: string; color: string };

function InfoRow({
  icon: Icon,
  label,
  value,
  button,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value?: string;
  button: ButtonProps & { onClick?: () => void };
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon size={20} className="text-[#14805e]" />
        <div className="flex flex-col">
          <span className="text-sm text-white">{label}</span>
          {value && <span className="text-xs text-[#14805e]">{value}</span>}
        </div>
      </div>
      {button.text ? (
        <button
          onClick={
            button.onClick ||
            (() => {
              if (label === "Full Name") {
                router.push("/add-fullname");
              } else if (label === "Birthday") {
                router.push("/add-birthday");
              } else if (label === "Phone Number") {
                if (button.text === "Add") {
                  router.push("/add-phone");
                } else if (button.text === "Not Verified") {
                  router.push("/verification?type=phone");
                }
              } else if (label === "Email") {
                if (button.text === "Add") {
                  router.push("/add-email");
                } else if (button.text === "Not Verified") {
                  router.push(
                    "/verification?type=email&email=" +
                      encodeURIComponent(value || "")
                  );
                }
              }
            })
          }
          className={`
    ${
      button.text !== "Verified"
        ? button.color
        : "bg-transparent border border-green-500"
    } 
    text-white text-sm font-medium 
    px-4 py-2 rounded-md 
    ${button.text === "Not Verified" ? "w-32" : "w-24"}
  `}
        >
          {button.text}
        </button>
      ) : null}
    </div>
  );
}
